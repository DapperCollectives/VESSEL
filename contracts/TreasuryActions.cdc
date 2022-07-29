import MyMultiSigV2 from "./MyMultiSig.cdc"
import DAOTreasuryV2 from "./DAOTreasury.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract TreasuryActionsV2 {

  ///////////
  // Events
  ///////////

  // TransferToken
  pub event TransferTokenToAccountActionCreated(
    recipientAddr: Address, vaultID: String, amount: UFix64
  )
  pub event TransferTokenToAccountActionExecuted(
    recipientAddr: Address, vaultID: String, amount: UFix64, treasuryAddr: Address
  )

  // TransferTokenToTreasury
  pub event TransferTokenToTreasuryActionCreated(
    recipientAddr: Address, vaultID: String, amount: UFix64
  )
  pub event TransferTokenToTreasuryActionExecuted(
    recipientAddr: Address, vaultID: String, amount: UFix64, treasuryAddr: Address
  )

  // TransferNFT
  pub event TransferNFTToAccountActionCreated(
    recipientAddr: Address, collectionID: String, nftID: UInt64
  )
  pub event TransferNFTToAccountActionExecuted(
    recipientAddr: Address, collectionID: String, nftID: UInt64, treasuryAddr: Address
  )

  // TransferNFTToTreasury
  pub event TransferNFTToTreasuryActionCreated(
    recipientAddr: Address, collectionID: String, nftID: UInt64
  )
  pub event TransferNFTToTreasuryActionExecuted(
    recipientAddr: Address, collectionID: String, nftID: UInt64, treasuryAddr: Address
  )

  // Add Signer
  pub event AddSignerActionCreated(address: Address)
  pub event AddSignerActionExecuted(address: Address, treasuryAddr: Address)
  
  // Remove Signer
  pub event RemoveSignerActionCreated(address: Address)
  pub event RemoveSignerActionExecuted(address: Address, treasuryAddr: Address)

  // Update Threshold
  pub event UpdateThresholdActionCreated(threshold: UInt64)
  pub event UpdateThresholdActionExecuted(oldThreshold: UInt64, newThreshold: UInt64, treasuryAddr: Address)

  // Destroy Action
  pub event DestroyActionActionCreated(actionUUID: UInt64)
  pub event DestroyActionActionExecuted(actionUUID: UInt64, treasuryAddr: Address)

  // Transfers `amount` tokens from the treasury to `recipientVault`
  pub struct TransferToken: MyMultiSigV2.Action {
    pub let intent: String
    pub let proposer: Address
    pub let recipientVault: Capability<&{FungibleToken.Receiver}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury
      let vaultID: String = self.recipientVault.borrow()!.getType().identifier
      let withdrawnTokens <- treasuryRef.withdrawTokens(identifier: vaultID, amount: self.amount)
      self.recipientVault.borrow()!.deposit(from: <- withdrawnTokens)

      emit TransferTokenToAccountActionExecuted(
        recipientAddr: self.recipientVault.borrow()!.owner!.address,
        vaultID: self.recipientVault.getType().identifier,
        amount: self.amount,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientVault: Capability<&{FungibleToken.Receiver}>, _amount: UFix64, _proposer: Address) {
      pre {
        _amount > 0.0 : "Amount should be higher than 0.0"  
      }

      self.intent = "Transfer "
                        .concat(_amount.toString())
                        .concat(" ")
                        .concat(_recipientVault.getType().identifier)
                        .concat(" tokens from the treasury to ")
                        .concat(_recipientVault.borrow()!.owner!.address.toString())
      self.recipientVault = _recipientVault
      self.amount = _amount
      self.proposer = _proposer

      emit TransferTokenToAccountActionCreated(
        recipientAddr: _recipientVault.borrow()!.owner!.address,
        vaultID: _recipientVault.getType().identifier,
        amount: _amount
      )
    }
  }

  // Transfers `amount` of `identifier` tokens from the treasury to another treasury
  pub struct TransferTokenToTreasury: MyMultiSigV2.Action {
    pub let intent: String
    pub let proposer: Address
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasuryV2.TreasuryPublic}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury
      let withdrawnTokens <- treasuryRef.withdrawTokens(identifier: self.identifier, amount: self.amount)

      let recipientAddr = self.recipientTreasury.borrow()!.owner!.address
      self.recipientTreasury.borrow()!.depositTokens(identifier: self.identifier, vault: <- withdrawnTokens)

      emit TransferTokenToTreasuryActionExecuted(
        recipientAddr: recipientAddr,
        vaultID: self.identifier,
        amount: self.amount,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientTreasury: Capability<&{DAOTreasuryV2.TreasuryPublic}>, _identifier: String, _amount: UFix64, _proposer: Address) {
      pre {
        _amount > 0.0 : "Amount should be higher than 0.0"  
      }
      
      let recipientAddr = _recipientTreasury.borrow()!.owner!.address
      self.intent = "Transfer "
                        .concat(_amount.toString())
                        .concat(" ")
                        .concat(_identifier)
                        .concat(" tokens from the treasury to ")
                        .concat(recipientAddr.toString())
      self.proposer = _proposer
      self.identifier = _identifier
      self.recipientTreasury = _recipientTreasury
      self.amount = _amount

      emit TransferTokenToTreasuryActionCreated(
        recipientAddr: recipientAddr,
        vaultID: _identifier,
        amount: _amount
      )
    }
  }

  // Transfers an NFT from the treasury to `recipientCollection`
  pub struct TransferNFT: MyMultiSigV2.Action {
    pub let intent: String
    pub let proposer: Address
    pub let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury
      let collectionID = self.recipientCollection.borrow()!.getType().identifier
      
      let nft <- treasuryRef.withdrawNFT(identifier: collectionID, id: self.withdrawID)

      self.recipientCollection.borrow()!.deposit(token: <- nft)

      emit TransferNFTToAccountActionExecuted(
        recipientAddr: self.recipientCollection.borrow()!.owner!.address,
        collectionID: collectionID,
        nftID: self.withdrawID,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>, _nftID: UInt64, _proposer: Address) {
      let recipientAddr = _recipientCollection.borrow()!.owner!.address
      let collectionID = _recipientCollection.getType().identifier

      self.intent = "Transfer a "
                        .concat(collectionID)
                        .concat(" NFT from the treasury to ")
                        .concat(recipientAddr.toString())
      self.proposer = _proposer
      self.recipientCollection = _recipientCollection
      self.withdrawID = _nftID
      emit TransferNFTToAccountActionCreated(
        recipientAddr: recipientAddr,
        collectionID: collectionID,
        nftID: _nftID
      )
    }
  }

  // Transfers an NFT from the treasury to another treasury
  pub struct TransferNFTToTreasury: MyMultiSigV2.Action {
    pub let intent: String
    pub let proposer: Address
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasuryV2.TreasuryPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury
      let nft <- treasuryRef.withdrawNFT(identifier: self.identifier, id: self.withdrawID)

      let recipientCollectionRef: &{NonFungibleToken.CollectionPublic} = self.recipientTreasury.borrow()!.borrowCollectionPublic(identifier: self.identifier)
      recipientCollectionRef.deposit(token: <- nft)

      emit TransferNFTToTreasuryActionExecuted(
        recipientAddr: self.recipientTreasury.borrow()!.owner!.address,
        collectionID: self.identifier,
        nftID: self.withdrawID,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientTreasury: Capability<&{DAOTreasuryV2.TreasuryPublic}>, _identifier: String, _nftID: UInt64, _proposer: Address) {
      let recipientAddr = _recipientTreasury.borrow()!.owner!.address
      self.intent = "Transfer an NFT from collection"
                        .concat(" ")
                        .concat(_identifier)
                        .concat(" with ID ")
                        .concat(_nftID.toString())
                        .concat(" ")
                        .concat("from this Treasury to Treasury at address ")
                        .concat(recipientAddr.toString())
      self.identifier = _identifier
      self.recipientTreasury = _recipientTreasury
      self.withdrawID = _nftID
      self.proposer = _proposer

      emit TransferNFTToTreasuryActionCreated(
        recipientAddr: recipientAddr,
        collectionID: _identifier,
        nftID: _nftID
      )
    }
  }

  // Add a new signer to the treasury
  pub struct AddSigner: MyMultiSigV2.Action {
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury

      let manager = treasuryRef.borrowManager()
      manager.addSigner(signer: self.signer)

      emit AddSignerActionExecuted(address: self.signer, treasuryAddr: treasuryRef.owner!.address)
    }

    init(_signer: Address, _proposer: Address) {
      self.proposer = _proposer
      self.signer = _signer
      self.intent = "Add account "
                      .concat(_signer.toString())
                      .concat(" as a signer.")
      emit AddSignerActionCreated(address: _signer)
    }
  }

  // Remove a signer from the treasury
  pub struct RemoveSigner: MyMultiSigV2.Action {
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury

      let manager = treasuryRef.borrowManager()
      manager.removeSigner(signer: self.signer)
      emit RemoveSignerActionExecuted(address: self.signer, treasuryAddr: treasuryRef.owner!.address)
    }

    init(_signer: Address, _proposer: Address) {
      self.proposer = _proposer
      self.signer = _signer
      self.intent = "Remove "
                      .concat(_signer.toString())
                      .concat(" as a signer.")
      emit RemoveSignerActionCreated(address: _signer)
    }
  }

  // Update the threshold of signers
  pub struct UpdateThreshold: MyMultiSigV2.Action {
    pub let threshold: UInt64
    pub let intent: String
    pub let proposer: Address

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury

      let manager = treasuryRef.borrowManager()
      let oldThreshold = manager.threshold
      manager.updateThreshold(newThreshold: self.threshold)
      emit UpdateThresholdActionExecuted(oldThreshold: oldThreshold, newThreshold: self.threshold, treasuryAddr: treasuryRef.owner!.address)
    }

    init(_threshold: UInt64, _proposer: Address) {
      self.threshold = _threshold
      self.proposer = _proposer
      self.intent = "Update the threshold of signers to ".concat(_threshold.toString()).concat(".")
      emit UpdateThresholdActionCreated(threshold: _threshold)
    }
  }

  // Destroy the action
  pub struct DestroyAction: MyMultiSigV2.Action {
    pub let actionUUID: UInt64
    pub let intent: String
    pub let proposer: Address

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV2.Treasury = params["treasury"]! as! &DAOTreasuryV2.Treasury

      let manager = treasuryRef.borrowManager()
      manager.destroyAction(actionUUID: self.actionUUID)
      emit DestroyActionActionExecuted(actionUUID: self.actionUUID, treasuryAddr: treasuryRef.owner!.address)
    }

    init(_actionUUID: UInt64, _proposer: Address) {
      self.actionUUID = _actionUUID
      self.proposer = _proposer
      self.intent = "Remove the action "
                      .concat(_actionUUID.toString())
                      .concat(" from the Treasury.")
      emit DestroyActionActionCreated(actionUUID: _actionUUID)
    }
  }
}