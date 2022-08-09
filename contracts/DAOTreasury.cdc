import MyMultiSigV2 from "./MyMultiSig.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract DAOTreasuryV2 {

  pub let TreasuryStoragePath: StoragePath
  pub let TreasuryPublicPath: PublicPath

  // Events
  pub event TreasuryInitialized(initialSigners: [Address], initialThreshold: UInt64)
  pub event ProposeAction(actionUUID: UInt64, proposer: Address)
  pub event ExecuteAction(actionUUID: UInt64, proposer: Address)
  pub event DepositVault(vaultID: String)
  pub event DepositCollection(collectionID: String)
  pub event DepositTokens(identifier: String)
  pub event DepositNFT(collectionID: String, nftID: UInt64)
  pub event WithdrawTokens(vaultID: String, amount: UFix64)
  pub event WithdrawNFT(collectionID: String, nftID: UInt64)


  // Interfaces + Resources
  pub resource interface TreasuryPublic {
    pub fun proposeAction(action: {MyMultiSigV2.Action}, signaturePayload: MyMultiSigV2.MessageSignaturePayload): UInt64
    pub fun executeAction(actionUUID: UInt64, signaturePayload: MyMultiSigV2.MessageSignaturePayload)
    pub fun signerDepositCollection(collection: @NonFungibleToken.Collection, signaturePayload: MyMultiSigV2.MessageSignaturePayload)
    pub fun depositTokens(identifier: String, vault: @FungibleToken.Vault)
    pub fun depositNFT(identifier: String, nft: @NonFungibleToken.NFT)
    pub fun borrowManagerPublic(): &MyMultiSigV2.Manager{MyMultiSigV2.ManagerPublic}
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance}
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic}
    pub fun getVaultIdentifiers(): [String]
    pub fun getCollectionIdentifiers(): [String]
  }

  pub resource Treasury: MyMultiSigV2.MultiSign, TreasuryPublic {
    access(contract) let multiSignManager: @MyMultiSigV2.Manager
    access(self) var vaults: @{String: FungibleToken.Vault}
    access(self) var collections: @{String: NonFungibleToken.Collection}

    // ------- Manager -------   
    pub fun proposeAction(action: {MyMultiSigV2.Action}, signaturePayload: MyMultiSigV2.MessageSignaturePayload): UInt64 {
      self.validateTreasurySigner(identifier: action.intent, signaturePayload: signaturePayload)

      let uuid = self.multiSignManager.createMultiSign(action: action)
      emit ProposeAction(actionUUID: uuid, proposer: action.proposer)
      return uuid
    }

    /*
      Note that we pass through a reference to this entire
      treasury as a parameter here. So the action can do whatever it 
      wants. This means it's very imporant for the signers
      to know what they are signing.
    */
    pub fun executeAction(actionUUID: UInt64, signaturePayload: MyMultiSigV2.MessageSignaturePayload) {
      self.validateTreasurySigner(identifier: actionUUID.toString(), signaturePayload: signaturePayload)

      let selfRef: &Treasury = &self as &Treasury
      self.multiSignManager.executeAction(actionUUID: actionUUID, {"treasury": selfRef})
      emit ExecuteAction(actionUUID: actionUUID, proposer: signaturePayload.signingAddr)
    }

    access(self) fun validateTreasurySigner(identifier: String, signaturePayload: MyMultiSigV2.MessageSignaturePayload) {
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {identifier hex}{blockId}
      var counter = 0
      let signingBlock = getBlock(at: signaturePayload.signatureBlock)!
      let blockId = signingBlock.id
      let blockIds: [UInt8] = []

      while (counter < blockId.length) {
          blockIds.append(blockId[counter])
          counter = counter + 1
      }

      let blockIdHex = String.encodeHex(blockIds)
      let identifierHex = String.encodeHex(identifier.utf8)

      let message = signaturePayload.message
      // Identifier
      assert(
        identifierHex == message.slice(from: 0, upTo: identifierHex.length),
        message: "Invalid Message: incorrect identifier"
      )
      // Block ID
      assert(
        blockIdHex == message.slice(from: identifierHex.length, upTo: message.length),
        message: "Invalid Message: invalid blockId"
      )

      // ------ Validate Signature -------
      var signatureValidationResponse = MyMultiSigV2.validateSignature(payload: signaturePayload)

      assert(
        signatureValidationResponse.isValid == true,
        message: "Invalid Signature"
      )
      assert(
        signatureValidationResponse.totalWeight >= 999.0,
        message: "Insufficient Key Weights: sum of total signing key weights must be >= 999.0"
      )
    }

    // Reference to Manager //
    access(account) fun borrowManager(): &MyMultiSigV2.Manager {
      return &self.multiSignManager as &MyMultiSigV2.Manager
    }

    pub fun borrowManagerPublic(): &MyMultiSigV2.Manager{MyMultiSigV2.ManagerPublic} {
      return &self.multiSignManager as &MyMultiSigV2.Manager{MyMultiSigV2.ManagerPublic}
    }

    // ------- Vaults ------- 

    // Deposit a Vault //
    pub fun depositVault(vault: @FungibleToken.Vault) {
      let identifier = vault.getType().identifier
      if self.vaults[identifier] != nil {
        self.vaults[identifier]?.deposit!(from: <- vault)
      } else {
        self.vaults[identifier] <-! vault
      }
      emit DepositVault(vaultID: identifier)
    }

    // Withdraw some tokens //
    access(account) fun withdrawTokens(identifier: String, amount: UFix64): @FungibleToken.Vault {
      emit WithdrawTokens(vaultID: identifier, amount: amount)
      let vaultRef = (&self.vaults[identifier] as &FungibleToken.Vault?)!
      return <- vaultRef.withdraw(amount: amount)
    }

    // Public Reference to Vault //
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance} {
      return (&self.vaults[identifier] as &{FungibleToken.Balance}?)!
    }

    pub fun getVaultIdentifiers(): [String] {
      return self.vaults.keys
    }


    // ------- Collections ------- 

    pub fun signerDepositCollection(collection: @NonFungibleToken.Collection, signaturePayload: MyMultiSigV2.MessageSignaturePayload) {
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {collection identifier hex}{blockId}
      var counter = 0
      let signingBlock = getBlock(at: signaturePayload.signatureBlock)!
      let blockId = signingBlock.id
      let blockIds: [UInt8] = []

      while (counter < blockId.length) {
          blockIds.append(blockId[counter])
          counter = counter + 1
      }

      let blockIdHex = String.encodeHex(blockIds)
      let collectionIdHex = String.encodeHex(collection.getType().identifier.utf8)

      let message = signaturePayload.message
      // Collection Identifier
      assert(
        collectionIdHex == message.slice(from: 0, upTo: collectionIdHex.length),
        message: "Invalid Message: incorrect collection identifier"
      )
      // Block ID
      assert(
        blockIdHex == message.slice(from: collectionIdHex.length, upTo: message.length),
        message: "Invalid Message: invalid blockId"
      )

      // ------ Validate Signature -------
      var signatureValidationResponse = MyMultiSigV2.validateSignature(payload: signaturePayload)

      assert(
        signatureValidationResponse.isValid == true,
        message: "Invalid Signature"
      )
      assert(
        signatureValidationResponse.totalWeight >= 999.0,
        message: "Insufficient Key Weights: sum of total signing key weights must be >= 999.0"
      )

      // If all asserts passed, deposit vault into Treasury
      self.depositCollection(collection: <- collection)
    }

    // Deposit a Collection //
    pub fun depositCollection(collection: @NonFungibleToken.Collection) {
      let identifier = collection.getType().identifier
      self.collections[identifier] <-! collection
      emit DepositCollection(collectionID: identifier)
    }

    // Deposit tokens //
    pub fun depositTokens(identifier: String, vault: @FungibleToken.Vault) {
      emit DepositTokens(identifier: identifier)

      let vaultRef = (&self.vaults[identifier] as &FungibleToken.Vault?)!
      vaultRef.deposit(from: <- vault)
    }


    // Deposit an NFT //
    pub fun depositNFT(identifier: String, nft: @NonFungibleToken.NFT) {
      emit DepositNFT(collectionID: identifier, nftID: nft.id)

      let collectionRef = (&self.collections[identifier] as &NonFungibleToken.Collection?)!
      collectionRef.deposit(token: <- nft)
    }

    // Withdraw an NFT //
    access(account) fun withdrawNFT(identifier: String, id: UInt64): @NonFungibleToken.NFT {
      emit WithdrawNFT(collectionID: identifier, nftID: id)
      let collectionRef = (&self.collections[identifier] as &NonFungibleToken.Collection?)!
      return <- collectionRef.withdraw(withdrawID: id)
    }

    // Public Reference to Collection //
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic} {
      return (&self.collections[identifier] as &{NonFungibleToken.CollectionPublic}?)!
    }

     pub fun getCollectionIdentifiers(): [String] {
      return self.collections.keys
    }

    init(initialSigners: [Address], initialThreshold: UInt64) {
      self.multiSignManager <- MyMultiSigV2.createMultiSigManager(signers: initialSigners, threshold: initialThreshold)
      self.vaults <- {}
      self.collections <- {}
    }

    destroy() {
      // Check if Valuts are empty
      for identifier in self.vaults.keys {
        let vaultRef = (&self.vaults[identifier] as &FungibleToken.Vault?)!
        assert(vaultRef.balance == 0.0, message: "Vault is not empty! Treasury cannot be destroyed.")
      }

      // Check if Collections are empty
      for identifier in self.collections.keys {
        let collectionRef = (&self.collections[identifier] as &NonFungibleToken.Collection?)!
        assert(collectionRef.getIDs().length == 0, message: "Collection is not empty! Treasury cannot be destroyed.")
      }

      // Only destroy if both vaults and collections are empty
      destroy self.multiSignManager
      destroy self.vaults
      destroy self.collections
    }
  }
  
  pub fun createTreasury(initialSigners: [Address], initialThreshold: UInt64): @Treasury {
    return <- create Treasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
  }

  init() {
    self.TreasuryStoragePath = /storage/DAOTreasury003
    self.TreasuryPublicPath = /public/DAOTreasury003
  }

}