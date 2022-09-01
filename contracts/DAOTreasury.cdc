import MyMultiSigV3 from "./MyMultiSig.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"
import FCLCrypto from "./core/FCLCrypto.cdc"

pub contract DAOTreasuryV3 {

  pub let TreasuryStoragePath: StoragePath
  pub let TreasuryPublicPath: PublicPath

  // ------- Events ------

  // Treasury
  pub event TreasuryInitialized(initialSigners: [Address], initialThreshold: UInt)

  // Actions
  pub event ActionProposed(treasuryUUID: UInt64, actionUUID: UInt64, proposer: Address, actionView: MyMultiSigV3.ActionView)
  pub event ActionExecuted(treasuryUUID: UInt64, actionUUID: UInt64, executor: Address, actionView: MyMultiSigV3.ActionView, signerResponses: {Address: UInt})
  pub event ActionDestroyed(treasuryUUID: UInt64, actionUUID: UInt64, signerResponses: {Address: UInt})
  pub event ActionApprovedBySigner(treasuryUUID: UInt64, address: Address, uuid: UInt64, signerResponses: {Address: UInt})
  pub event ActionRejectedBySigner(treasuryUUID: UInt64, address: Address, uuid: UInt64, signerResponses: {Address: UInt})

  // Vaults
  pub event VaultDeposited(treasuryUUID: UInt64, signerAddr: Address, vaultID: String)
  pub event VaultDestroyed(treasuryUUID: UInt64, signerAddr: Address, vaultID: String)

  // Collections
  pub event CollectionDeposited(treasuryUUID: UInt64, signerAddr: Address, collectionID: String)
  pub event CollectionDestroyed(treasuryUUID: UInt64, signerAddr: Address, collectionID: String)

  // Tokens
  pub event TokensDeposited(treasuryUUID: UInt64, identifier: String)

  // NFTs
  pub event NFTDeposited(treasuryUUID: UInt64, collectionID: String, nftID: UInt64)

  //
  // ------- Interfaces + Resources -------
  //
  pub resource interface TreasuryPublic {
    pub fun signerApproveAction(actionUUID: UInt64, messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload)
    pub fun signerRejectAction(actionUUID: UInt64, messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload)
    pub fun proposeAction(action: {MyMultiSigV3.Action}, signaturePayload: MyMultiSigV3.MessageSignaturePayload): UInt64
    pub fun executeAction(actionUUID: UInt64, signaturePayload: MyMultiSigV3.MessageSignaturePayload)
    pub fun signerDepositCollection(collection: @NonFungibleToken.Collection, signaturePayload: MyMultiSigV3.MessageSignaturePayload)
    pub fun signerRemoveCollection(identifier: String, signaturePayload: MyMultiSigV3.MessageSignaturePayload)
    pub fun signerDepositVault(vault: @FungibleToken.Vault, signaturePayload: MyMultiSigV3.MessageSignaturePayload)
    pub fun signerRemoveVault(identifier: String, signaturePayload: MyMultiSigV3.MessageSignaturePayload)
    pub fun depositTokens(identifier: String, vault: @FungibleToken.Vault)
    pub fun depositNFT(identifier: String, nft: @NonFungibleToken.NFT)
    pub fun borrowManagerPublic(): &MyMultiSigV3.Manager{MyMultiSigV3.ManagerPublic}
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance}
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic}
    pub fun getVaultIdentifiers(): [String]
    pub fun getCollectionIdentifiers(): [String]
  }

  pub resource Treasury: MyMultiSigV3.MultiSign, TreasuryPublic {
    access(contract) let multiSignManager: @MyMultiSigV3.Manager
    access(self) var vaults: @{String: FungibleToken.Vault}
    access(self) var collections: @{String: NonFungibleToken.Collection}

    pub fun signerApproveAction(actionUUID: UInt64, messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload) {
      self.multiSignManager.signerApproveAction(actionUUID: actionUUID, messageSignaturePayload: messageSignaturePayload) 
      let signerResponses = self.multiSignManager.getSignerResponsesForAction(actionUUID: actionUUID)
      emit ActionApprovedBySigner(treasuryUUID: self.uuid, address: messageSignaturePayload.signingAddr, uuid: self.uuid, signerResponses: signerResponses)
    }

    pub fun signerRejectAction(actionUUID: UInt64, messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload) {
      self.multiSignManager.signerRejectAction(actionUUID: actionUUID, messageSignaturePayload: messageSignaturePayload) 
      let signerResponses = self.multiSignManager.getSignerResponsesForAction(actionUUID: actionUUID)
      emit ActionRejectedBySigner(treasuryUUID: self.uuid, address: messageSignaturePayload.signingAddr, uuid: self.uuid, signerResponses: signerResponses)

      // Destroy action if there are sufficient rejections
      if self.multiSignManager.canDestroyAction(actionUUID: actionUUID) {
         self.multiSignManager.attemptDestroyAction(actionUUID: actionUUID)
         emit ActionDestroyed(treasuryUUID: self.uuid, actionUUID: actionUUID, signerResponses: signerResponses)
      }
    }

    pub fun proposeAction(action: {MyMultiSigV3.Action}, signaturePayload: MyMultiSigV3.MessageSignaturePayload): UInt64 {
      self.validateTreasurySigner(identifier: action.intent, signaturePayload: signaturePayload)

      let uuid = self.multiSignManager.createMultiSign(action: action)
      let action = self.multiSignManager.borrowAction(actionUUID: uuid)
      emit ActionProposed(treasuryUUID: self.uuid, actionUUID: uuid, proposer: action.proposer, actionView: action.getView())
      return uuid
    }

    /*
      Note that we pass through a reference to this entire
      treasury as a parameter here. So the action can do whatever it 
      wants. This means it's very imporant for the signers
      to know what they are signing.
    */
    pub fun executeAction(actionUUID: UInt64, signaturePayload: MyMultiSigV3.MessageSignaturePayload) {
      self.validateTreasurySigner(identifier: actionUUID.toString(), signaturePayload: signaturePayload)

      let action = self.multiSignManager.borrowAction(actionUUID: actionUUID)
      let actionView = action.getView()
      let selfRef: &Treasury = &self as &Treasury
      let signerResponses = self.multiSignManager.getSignerResponsesForAction(actionUUID: actionUUID)
      self.multiSignManager.executeAction(actionUUID: actionUUID, {"treasury": selfRef})
      emit ActionExecuted(
        treasuryUUID: self.uuid,
        actionUUID: actionUUID,
        executor: signaturePayload.signingAddr,
        actionView: actionView,
        signerResponses: signerResponses
      )
    }

    access(self) fun validateTreasurySigner(identifier: String, signaturePayload: MyMultiSigV3.MessageSignaturePayload) {
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {identifier hex}{blockId}
      let message = signaturePayload.message

      // ------- Validate Identifier -------
      let identifierHex = String.encodeHex(identifier.utf8)
      assert(
        identifierHex == message.slice(from: 0, upTo: identifierHex.length),
        message: "Invalid Message: incorrect identifier"
      )

      // ------ Validate Block ID --------
      MyMultiSigV3.validateMessageBlockId(blockHeight: signaturePayload.signatureBlock, messageBlockId: message.slice(from: identifierHex.length, upTo: message.length))

      // ------ Validate Signature -------
      let signatureValidationResponse = FCLCrypto.verifyUserSignatures(
        address: signaturePayload.signingAddr,
        message: String.encodeHex(signaturePayload.message.utf8),
        keyIndices: signaturePayload.keyIds,
        signatures: signaturePayload.signatures
      )
      assert(
        signatureValidationResponse == true,
        message: "Invalid Signature"
      )
    }

    // Reference to Manager //
    access(account) fun borrowManager(): &MyMultiSigV3.Manager {
      return &self.multiSignManager as &MyMultiSigV3.Manager
    }

    pub fun borrowManagerPublic(): &MyMultiSigV3.Manager{MyMultiSigV3.ManagerPublic} {
      return &self.multiSignManager as &MyMultiSigV3.Manager{MyMultiSigV3.ManagerPublic}
    }

    // ------- Vaults ------- 

    pub fun signerRemoveVault(identifier: String, signaturePayload: MyMultiSigV3.MessageSignaturePayload) {
      pre {
        self.vaults[identifier] != nil: "Vault doesn't exist in this treasury."
        self.vaults[identifier]?.balance == 0.0: "Vault must be empty before it can be removed."
      }
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {collection identifier hex}{blockId}
      let message = signaturePayload.message

      // ----- Validate Vault Identifier -----
      let vaultIdHex = String.encodeHex(identifier.utf8)
      assert(
        vaultIdHex == message.slice(from: 0, upTo: vaultIdHex.length),
        message: "Invalid Message: incorrect vault identifier"
      )

      // ------ Validate Block ID --------
      MyMultiSigV3.validateMessageBlockId(blockHeight: signaturePayload.signatureBlock, messageBlockId: message.slice(from: vaultIdHex.length, upTo: message.length))

      // ------ Validate Signature -------
      let signatureValidationResponse = FCLCrypto.verifyUserSignatures(
          address: signaturePayload.signingAddr,
          message: String.encodeHex(signaturePayload.message.utf8),
          keyIndices: signaturePayload.keyIds,
          signatures: signaturePayload.signatures
      )
      assert(
        signatureValidationResponse == true,
        message: "Invalid Signature"
      )

      // If all asserts passed, remove vault from the Treasury and destroy
      let vault <- self.vaults.remove(key: identifier)
      destroy vault
      emit VaultDestroyed(treasuryUUID: self.uuid, vaultID: identifier)
    }

    // Deposit a Vault //
    pub fun depositVault(vault: @FungibleToken.Vault) {
      let identifier = vault.getType().identifier
      if self.vaults[identifier] != nil {
        self.vaults[identifier]?.deposit!(from: <- vault)
      } else {
        self.vaults[identifier] <-! vault
      }
      emit VaultDeposited(treasuryUUID: self.uuid, vaultID: identifier)
    }

    // Withdraw some tokens //
    access(account) fun withdrawTokens(identifier: String, amount: UFix64): @FungibleToken.Vault {
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

    pub fun signerDepositCollection(collection: @NonFungibleToken.Collection, signaturePayload: MyMultiSigV3.MessageSignaturePayload) {
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {collection identifier hex}{blockId}
      let message = signaturePayload.message

      // ------- Validate Collection Identifier -------
      let collectionIdHex = String.encodeHex(collection.getType().identifier.utf8)
      assert(
        collectionIdHex == message.slice(from: 0, upTo: collectionIdHex.length),
        message: "Invalid Message: incorrect collection identifier"
      )

      // ------ Validate Block ID --------
      MyMultiSigV3.validateMessageBlockId(blockHeight: signaturePayload.signatureBlock, messageBlockId: message.slice(from: collectionIdHex.length, upTo: message.length))

      // ------ Validate Signature -------
      let signatureValidationResponse = FCLCrypto.verifyUserSignatures(
          address: signaturePayload.signingAddr,
          message: String.encodeHex(signaturePayload.message.utf8),
          keyIndices: signaturePayload.keyIds,
          signatures: signaturePayload.signatures
      )
      assert(
        signatureValidationResponse == true,
        message: "Invalid Signature"
      )

      // If all asserts passed, deposit vault into Treasury
      self.depositCollection(collection: <- collection)
    }

    pub fun signerRemoveCollection(identifier: String, signaturePayload: MyMultiSigV3.MessageSignaturePayload) {
      pre {
        self.collections[identifier] != nil: "Collection doesn't exist in this treasury."
        self.collections[identifier]?.getIDs()?.length == 0 : "Collection must be empty before it can be removed."
      }
      // ------- Validate Address is a Signer on the Treasury -----
      let signers = self.multiSignManager.getSigners()
      assert(signers[signaturePayload.signingAddr] == true, message: "Address is not a signer on this Treasury")

      // ------- Validate Message --------
      // message format: {collection identifier hex}{blockId}

      let collectionIdHex = String.encodeHex(identifier.utf8)
      let message = signaturePayload.message

      // ------ Validate Collection Identifier ------
      assert(
        collectionIdHex == message.slice(from: 0, upTo: collectionIdHex.length),
        message: "Invalid Message: incorrect collection identifier"
      )

      // ------ Validate Block ID --------
      MyMultiSigV3.validateMessageBlockId(blockHeight: signaturePayload.signatureBlock, messageBlockId: message.slice(from: collectionIdHex.length, upTo: message.length))

      // ------ Validate Signature -------
      let signatureValidationResponse = FCLCrypto.verifyUserSignatures(
        address: signaturePayload.signingAddr,
        message: String.encodeHex(signaturePayload.message.utf8),
        keyIndices: signaturePayload.keyIds,
        signatures: signaturePayload.signatures
      )
      assert(
        signatureValidationResponse == true,
        message: "Invalid Signature"
      )

      // If all asserts passed, remove vault from the Treasury and destroy
      let collection <- self.collections.remove(key: identifier)
      destroy collection
      emit CollectionDestroyed(treasuryUUID: self.uuid, collectionID: identifier)
    }

    // Deposit a Collection //
    pub fun depositCollection(collection: @NonFungibleToken.Collection) {
      let identifier = collection.getType().identifier
      self.collections[identifier] <-! collection
      emit CollectionDeposited(treasuryUUID: self.uuid, collectionID: identifier)
    }

    // ------- Vaults ------- 
    pub fun signerDepositVault(vault: @FungibleToken.Vault, signaturePayload: MyMultiSigV3.MessageSignaturePayload) {
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
      let signatureValidationResponse = FCLCrypto.verifyUserSignatures(
        address: signaturePayload.signingAddr,
        message: String.encodeHex(signaturePayload.message.utf8),
        keyIndices: signaturePayload.keyIds,
        signatures: signaturePayload.signatures
      )
      assert(
        signatureValidationResponse == true,
        message: "Invalid Signature"
      )

      // If all asserts passed, deposit vault into Treasury
      self.depositVault(vault: <- vault)
    }

    // Deposit tokens //
    pub fun depositTokens(identifier: String, vault: @FungibleToken.Vault) {
      emit TokensDeposited(treasuryUUID: self.uuid, identifier: identifier)

      let vaultRef = (&self.vaults[identifier] as &FungibleToken.Vault?)!
      vaultRef.deposit(from: <- vault)
    }


    // Deposit an NFT //
    pub fun depositNFT(identifier: String, nft: @NonFungibleToken.NFT) {
      emit NFTDeposited(treasuryUUID: self.uuid, collectionID: identifier, nftID: nft.id)

      let collectionRef = (&self.collections[identifier] as &NonFungibleToken.Collection?)!
      collectionRef.deposit(token: <- nft)
    }

    // Withdraw an NFT //
    access(account) fun withdrawNFT(identifier: String, id: UInt64): @NonFungibleToken.NFT {
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

    init(initialSigners: [Address], initialThreshold: UInt) {
      self.multiSignManager <- MyMultiSigV3.createMultiSigManager(signers: initialSigners, threshold: initialThreshold)
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
  
  pub fun createTreasury(initialSigners: [Address], initialThreshold: UInt): @Treasury {
    return <- create Treasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
  }

  init() {
    self.TreasuryStoragePath = /storage/DAOTreasuryV3
    self.TreasuryPublicPath = /public/DAOTreasuryV3
  }

}