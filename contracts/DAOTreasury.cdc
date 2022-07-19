import MyMultiSig from "./MyMultiSig.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract DAOTreasury {

  pub let TreasuryStoragePath: StoragePath
  pub let TreasuryPublicPath: PublicPath

  // Events
  pub event TreasuryInitialized(initialSigners: [Address], initialThreshold: UInt64)
  pub event ProposeAction(actionUUID: UInt64, proposer: Address)
  pub event ExecuteAction(actionUUID: UInt64, proposer: Address)
  pub event DepositVault(vaultID: String)
  pub event DepositCollection(collectionID: String)
  pub event WithdrawTokens(vaultID: String, amount: UFix64)
  pub event WithdrawNFT(collectionID: String, nftID: UInt64)


  // Interfaces + Resources
  pub resource interface TreasuryPublic {
    pub fun proposeAction(action: {MyMultiSig.Action}, signaturePayload: MyMultiSig.MessageSignaturePayload): UInt64
    pub fun executeAction(actionUUID: UInt64, signaturePayload: MyMultiSig.MessageSignaturePayload)
    pub fun depositVault(vault: @FungibleToken.Vault)
    pub fun depositCollection(collection: @NonFungibleToken.Collection)
    pub fun borrowManagerPublic(): &MyMultiSig.Manager{MyMultiSig.ManagerPublic}
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance, FungibleToken.Receiver}
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic}
    pub fun getVaultIdentifiers(): [String]
    pub fun getCollectionIdentifiers(): [String]
  }

  pub resource Treasury: MyMultiSig.MultiSign, TreasuryPublic {
    access(contract) let multiSignManager: @MyMultiSig.Manager
    access(self) var vaults: @{String: FungibleToken.Vault}
    access(self) var collections: @{String: NonFungibleToken.Collection}

    // ------- Manager -------   
    pub fun proposeAction(action: {MyMultiSig.Action}, signaturePayload: MyMultiSig.MessageSignaturePayload): UInt64 {
      self.validateTreasurySigner(identifier: "no action id", signaturePayload: signaturePayload)

      let uuid = self.multiSignManager.createMultiSign(action: action)
      emit ProposeAction(actionUUID: uuid, proposer: action.proposer)
      return uuid
    }

    /*
      This is arguable the most important function.
      Note that we pass through a reference to this entire
      treasury as a parameter here. So the action can do whatever it 
      wants. This means it's very imporant for the signers
      to know what they are signing. But it is also brilliant because
      we can have EVERYTHING with a multisign.

      - Want to transfer tokens? Multisign.
      - Want to deposit an NFT? Multisign.  
      - Want to allocate some tokens to X, some tokens to Y,
        do a backflip, deposit to Z? Multisign.  
      - Want to add/remove signers? Multisign.  
      - The possibilities go on.
    */
    pub fun executeAction(actionUUID: UInt64, signaturePayload: MyMultiSig.MessageSignaturePayload) {
      self.validateTreasurySigner(identifier: actionUUID.toString(), signaturePayload: signaturePayload)

      let selfRef: &Treasury = &self as &Treasury
      self.multiSignManager.executeAction(actionUUID: actionUUID, {"treasury": selfRef})
      emit ExecuteAction(actionUUID: actionUUID, proposer: signaturePayload.signingAddr)
    }

    access(self) fun validateTreasurySigner(identifier: String, signaturePayload: MyMultiSig.MessageSignaturePayload) {
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
      var signatureValidationResponse = MyMultiSig.validateSignature(payload: signaturePayload)

      assert(
        signatureValidationResponse.isValid == true,
        message: "Invalid Signature"
      )
      assert(
        signatureValidationResponse.totalWeight >= 1000.0,
        message: "Insufficient Key Weights: sum of total signing key weights must be >= 1000.0"
      )
    }

    // Reference to Manager //
    access(account) fun borrowManager(): &MyMultiSig.Manager {
      return &self.multiSignManager as &MyMultiSig.Manager
    }

    pub fun borrowManagerPublic(): &MyMultiSig.Manager{MyMultiSig.ManagerPublic} {
      return &self.multiSignManager as &MyMultiSig.Manager{MyMultiSig.ManagerPublic}
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

    // Reference to Vault //
    access(account) fun borrowVault(identifier: String): &FungibleToken.Vault {
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

    // Deposit a Collection //
    pub fun depositCollection(collection: @NonFungibleToken.Collection) {
      let identifier = collection.getType().identifier
      self.collections[identifier] <-! collection
      emit DepositCollection(collectionID: identifier)
    }

    // Withdraw an NFT //
    access(account) fun withdrawNFT(identifier: String, id: UInt64): @NonFungibleToken.NFT {
      emit WithdrawNFT(collectionID: identifier, nftID: id)
      let collectionRef = (&self.collections[identifier] as &NonFungibleToken.Collection?)!
      return <- collectionRef.withdraw(withdrawID: id)
    }

    // Reference to Collection //
    access(account) fun borrowCollection(identifier: String): &NonFungibleToken.Collection {
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
    return <- create Treasury(_initialSigners: initialSigners, _initialThreshold: initialThreshold)
  }

  init() {
    self.TreasuryStoragePath = /storage/DAOTreasury003
    self.TreasuryPublicPath = /public/DAOTreasury003
  }

}