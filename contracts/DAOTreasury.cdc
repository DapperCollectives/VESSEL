import MyMultiSig from "./MyMultiSig.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract DAOTreasury {

  pub let TreasuryStoragePath: StoragePath
  pub let TreasuryPublicPath: PublicPath

  // Events
  pub event TreasuryInitialized(initialSigners: [Address], initialThreshold: UInt64)
  pub event ProposeAction(actionUUID: UInt64)
  pub event ExecuteAction(actionUUID: UInt64)
  pub event DepositVault(vaultID: String)
  pub event DepositCollection(collectionID: String)
  pub event WithdrawTokens(vaultID: String, amount: UFix64)
  pub event WithdrawNFT(collectionID: String, nftID: UInt64)


  // Interfaces + Resources
  pub resource interface TreasuryPublic {
    pub fun proposeAction(action: {MyMultiSig.Action}): UInt64
    pub fun executeAction(actionUUID: UInt64)
    pub fun signerDepositVault(vault: @FungibleToken.Vault, signaturePayload: MyMultiSig.MessageSignaturePayload)
    pub fun signerDepositCollection(collection: @NonFungibleToken.Collection, signaturePayload: MyMultiSig.MessageSignaturePayload)
    pub fun borrowManagerPublic(): &MyMultiSig.Manager{MyMultiSig.ManagerPublic}
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance, FungibleToken.Receiver}
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic}
    pub fun getVaultIdentifiers(): [String]
    pub fun getCollectionIdentifiers(): [String]
  }

  pub resource Treasury: MyMultiSig.MultiSign, TreasuryPublic {
    pub let multiSignManager: @MyMultiSig.Manager
    access(account) var vaults: @{String: FungibleToken.Vault}
    access(account) var collections: @{String: NonFungibleToken.Collection}

    // ------- Manager -------   
    pub fun proposeAction(action: {MyMultiSig.Action}): UInt64 {
      let uuid = self.multiSignManager.createMultiSign(action: action)
      return uuid
    }

    /*
      Note that we pass through a reference to this entire
      treasury as a parameter here. So the action can do whatever it 
      wants. This means it's very imporant for the signers
      to know what they are signing.
    */
    pub fun executeAction(actionUUID: UInt64) {
      let selfRef: &Treasury = &self as &Treasury
      self.multiSignManager.executeAction(actionUUID: actionUUID, {"treasury": selfRef})
      emit ExecuteAction(actionUUID: actionUUID)
    }

    // Reference to Manager //
    pub fun borrowManager(): &MyMultiSig.Manager {
      return &self.multiSignManager as &MyMultiSig.Manager
    }

    pub fun borrowManagerPublic(): &MyMultiSig.Manager{MyMultiSig.ManagerPublic} {
      return &self.multiSignManager as &MyMultiSig.Manager{MyMultiSig.ManagerPublic}
    }

    // ------- Vaults ------- 

    pub fun signerDepositVault(vault: @FungibleToken.Vault, signaturePayload: MyMultiSig.MessageSignaturePayload) {
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {vault identifier hex}{blockId}
      var counter = 0
      let signingBlock = getBlock(at: signaturePayload.signatureBlock)!
      let blockId = signingBlock.id
      let blockIds: [UInt8] = []
      
      while (counter < blockId.length) {
          blockIds.append(blockId[counter])
          counter = counter + 1
      }

      let blockIdHex = String.encodeHex(blockIds)
      let vaultIdHex = String.encodeHex(vault.getType().identifier.utf8)

      let message = signaturePayload.message
      // Vault Identifier
      assert(
        vaultIdHex == message.slice(from: 0, upTo: vaultIdHex.length),
        message: "Invalid Message: incorrect vault identifier"
      )
      // Block ID
      assert(
        blockIdHex == message.slice(from: vaultIdHex.length, upTo: message.length),
        message: "Invalid Message: invalid blockId"
      )

      // ------ Validate Signature -------
      var signatureValidationResponse = MyMultiSig.validateSignature(payload: signaturePayload)

      assert(
        signatureValidationResponse.isValid == true,
        message: "Invalid Signature"
      )
      assert(
        signatureValidationResponse.totalWeight >= 999.0,
        message: "Insufficient Key Weights: sum of total signing key weights must be >= 999.0"
      )

      // If all asserts passed, deposit vault into Treasury
      self.depositVault(vault: <- vault)
    }

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
    access(self) fun withdrawTokens(identifier: String, amount: UFix64): @FungibleToken.Vault {
      emit WithdrawTokens(vaultID: identifier, amount: amount)
      let vaultRef = (&self.vaults[identifier] as &FungibleToken.Vault?)!
      return <- vaultRef.withdraw(amount: amount)
    }

    // Reference to Vault //
    pub fun borrowVault(identifier: String): &FungibleToken.Vault {
      return (&self.vaults[identifier] as &FungibleToken.Vault?)!
    }

    // Public Reference to Vault //
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance, FungibleToken.Receiver} {
      return (&self.vaults[identifier] as &{FungibleToken.Balance, FungibleToken.Receiver}?)!
    }

    pub fun getVaultIdentifiers(): [String] {
      return self.vaults.keys
    }


    // ------- Collections ------- 

    pub fun signerDepositCollection(collection: @NonFungibleToken.Collection, signaturePayload: MyMultiSig.MessageSignaturePayload) {
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {vault identifier hex}{blockId}
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
        message: "Invalid Message: incorrect vault identifier"
      )
      // Block ID
      assert(
        blockIdHex == message.slice(from: collectionIdHex.length, upTo: message.length),
        message: "Invalid Message: invalid blockId"
      )

      // ------ Validate Signature -------
      var signatureValidationResponse = MyMultiSig.validateSignature(payload: signaturePayload)

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

    // Withdraw an NFT //
    access(self) fun withdrawNFT(identifier: String, id: UInt64): @NonFungibleToken.NFT {
      emit WithdrawNFT(collectionID: identifier, nftID: id)
      let collectionRef = (&self.collections[identifier] as &NonFungibleToken.Collection?)!
      return <- collectionRef.withdraw(withdrawID: id)
    }

    // Reference to Collection //
    pub fun borrowCollection(identifier: String): &NonFungibleToken.Collection {
      return (&self.collections[identifier] as &NonFungibleToken.Collection?)!
    }

    // Public Reference to Collection //
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic} {
      return (&self.collections[identifier] as &{NonFungibleToken.CollectionPublic}?)!
    }

     pub fun getCollectionIdentifiers(): [String] {
      return self.collections.keys
    }

    init(_initialSigners: [Address], _initialThreshold: UInt64) {
      self.multiSignManager <- MyMultiSig.createMultiSigManager(signers: _initialSigners, threshold: _initialThreshold)
      self.vaults <- {}
      self.collections <- {}
    }

    destroy() {
      destroy self.multiSignManager
      destroy self.vaults
      destroy self.collections
    }
  }
  
  pub fun createTreasury(initialSigners: [Address], initialThreshold: UInt64): @Treasury {
    let treasury <- create Treasury(_initialSigners: initialSigners, _initialThreshold: initialThreshold)
    return <- treasury
  }

  init() {
    self.TreasuryStoragePath = /storage/DAOTreasury003
    self.TreasuryPublicPath = /public/DAOTreasury003
  }

}