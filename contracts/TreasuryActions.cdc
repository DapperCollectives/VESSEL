import MyMultiSigV5 from "./MyMultiSig.cdc"
import DAOTreasuryV5 from "./DAOTreasury.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract TreasuryActionsV5 {

  // Utility
  pub fun InitializeActionView(type: String, intent: String, proposer: Address, timestamp: UFix64): MyMultiSigV5.ActionView {
    return MyMultiSigV5.ActionView(
      type: type,
      intent: intent,
      proposer: proposer,
      timestamp: timestamp,
      recipient: nil,
      vaultId: nil,
      collectionId: nil,
      nftId: nil,
      tokenAmount: nil,
      signerAddr: nil,
      newThreshold: nil
    )
  }

  // Transfers `amount` tokens from the treasury to `recipientVault`
  pub struct TransferToken: MyMultiSigV5.Action {
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64
    pub let recipientVault: Capability<&{FungibleToken.Receiver}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury
      let vaultID: String = self.recipientVault.borrow()!.getType().identifier
      let withdrawnTokens <- treasuryRef.withdrawTokens(identifier: vaultID, amount: self.amount)
      self.recipientVault.borrow()!.deposit(from: <- withdrawnTokens)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "TransferToken",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.recipient = self.recipientVault.borrow()!.owner!.address
      view.vaultId = self.recipientVault.borrow()!.getType().identifier
      view.tokenAmount = self.amount
      return view
    }

    init(recipientVault: Capability<&{FungibleToken.Receiver}>, amount: UFix64, proposer: Address) {
      pre {
        amount > 0.0 : "Amount should be higher than 0.0"  
      }

      self.intent = "Transfer "
                        .concat(amount.toString())
                        .concat(" ")
                        .concat(recipientVault.borrow()!.getType().identifier)
                        .concat(" tokens from the treasury to ")
                        .concat(recipientVault.borrow()!.owner!.address.toString())
      self.recipientVault = recipientVault
      self.amount = amount
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
    }
  }

  // Transfers `amount` of `identifier` tokens from the treasury to another treasury
  pub struct TransferTokenToTreasury: MyMultiSigV5.Action {
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasuryV5.TreasuryPublic}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury
      let withdrawnTokens <- treasuryRef.withdrawTokens(identifier: self.identifier, amount: self.amount)

      let recipientAddr = self.recipientTreasury.borrow()!.owner!.address
      self.recipientTreasury.borrow()!.depositTokens(identifier: self.identifier, vault: <- withdrawnTokens)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "TransferTokenToTreasury",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.recipient = self.recipientTreasury.borrow()!.owner!.address
      view.vaultId = self.identifier
      view.tokenAmount = self.amount
      return view 
    }

    init(recipientTreasury: Capability<&{DAOTreasuryV5.TreasuryPublic}>, identifier: String, amount: UFix64, proposer: Address) {
      pre {
        amount > 0.0 : "Amount should be higher than 0.0"  
      }
      
      let recipientAddr = recipientTreasury.borrow()!.owner!.address
      self.intent = "Transfer "
                        .concat(amount.toString())
                        .concat(" ")
                        .concat(identifier)
                        .concat(" tokens from the treasury to ")
                        .concat(recipientAddr.toString())
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
      self.identifier = identifier
      self.recipientTreasury = recipientTreasury
      self.amount = amount
    }
  }

  // Transfers an NFT from the treasury to `recipientCollection`
  pub struct TransferNFT: MyMultiSigV5.Action {
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64
    pub let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury
      let collectionID = self.recipientCollection.borrow()!.getType().identifier
      
      let nft <- treasuryRef.withdrawNFT(identifier: collectionID, id: self.withdrawID)

      self.recipientCollection.borrow()!.deposit(token: <- nft)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "TransferNFT",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.recipient = self.recipientCollection.borrow()!.owner!.address
      view.collectionId = self.recipientCollection.borrow()!.getType().identifier
      view.nftId = self.withdrawID
      return view
    }

    init(recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>, nftID: UInt64, proposer: Address) {
      let recipientAddr = recipientCollection.borrow()!.owner!.address
      let collectionID = recipientCollection.borrow()!.getType().identifier

      self.intent = "Transfer "
                        .concat(collectionID)
                        .concat(" NFT from the treasury to ")
                        .concat(recipientAddr.toString())

      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
      self.recipientCollection = recipientCollection
      self.withdrawID = nftID
    }
  }

  // Transfers an NFT from the treasury to another treasury
  pub struct TransferNFTToTreasury: MyMultiSigV5.Action {
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasuryV5.TreasuryPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury
      let nft <- treasuryRef.withdrawNFT(identifier: self.identifier, id: self.withdrawID)

      let recipientCollectionRef: &{NonFungibleToken.CollectionPublic} = self.recipientTreasury.borrow()!.borrowCollectionPublic(identifier: self.identifier)
      recipientCollectionRef.deposit(token: <- nft)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "TransferNFTToTreasury",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.recipient = self.recipientTreasury.borrow()!.owner!.address
      view.collectionId = self.identifier
      view.nftId = self.withdrawID
      return view
    }

    init(recipientTreasury: Capability<&{DAOTreasuryV5.TreasuryPublic}>, identifier: String, nftID: UInt64, proposer: Address) {
      let recipientAddr = recipientTreasury.borrow()!.owner!.address
      self.intent = "Transfer an NFT from collection"
                        .concat(" ")
                        .concat(identifier)
                        .concat(" with ID ")
                        .concat(nftID.toString())
                        .concat(" ")
                        .concat("from this Treasury to Treasury at address ")
                        .concat(recipientAddr.toString())
      self.identifier = identifier
      self.recipientTreasury = recipientTreasury
      self.withdrawID = nftID
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
    }
  }

  // Add a new signer to the treasury
  pub struct AddSigner: MyMultiSigV5.Action {
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury

      let manager = treasuryRef.borrowManager()
      manager.addSigner(signer: self.signer)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "AddSigner",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      ) 
      view.signerAddr = self.signer
      return view
    }

    init(signer: Address, proposer: Address) {
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
      self.signer = signer
      self.intent = "Add account "
                      .concat(signer.toString())
                      .concat(" as a signer.")
    }
  }

  // Remove a signer from the treasury
  pub struct RemoveSigner: MyMultiSigV5.Action {
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury

      let manager = treasuryRef.borrowManager()
      manager.removeSigner(signer: self.signer)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "RemoveSigner",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.signerAddr = self.signer
      return view
    }

    init(signer: Address, proposer: Address) {
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
      self.signer = signer
      self.intent = "Remove "
                      .concat(signer.toString())
                      .concat(" as a signer.")
    }
  }

  // Update the threshold of signers
  pub struct UpdateThreshold: MyMultiSigV5.Action {
    pub let threshold: UInt
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury

      let manager = treasuryRef.borrowManager()
      let oldThreshold = manager.threshold
      manager.updateThreshold(newThreshold: self.threshold)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "UpdateThreshold",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.newThreshold = self.threshold
      return view
    }

    init(threshold: UInt, proposer: Address) {
      self.threshold = threshold
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
      self.intent = "Update the threshold of signers to ".concat(threshold.toString()).concat(".")
    }
  }

  pub struct AddSignerUpdateThreshold: MyMultiSigV5.Action {
    pub let threshold: UInt
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury
      let manager = treasuryRef.borrowManager()

      // Add Signer
      manager.addSigner(signer: self.signer)
      // Update Threshold
      manager.updateThreshold(newThreshold: self.threshold)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "AddSignerUpdateThreshold",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.newThreshold = self.threshold
      view.signerAddr = self.signer
      return view
    }

    init(signer: Address, threshold: UInt, proposer: Address) {
      self.signer = signer
      self.threshold = threshold
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
      self.intent = "Add signer "
        .concat(signer.toString())
        .concat(". Update the threshold of signers to ")
        .concat(threshold.toString()).concat(".")
    }
  }

  pub struct RemoveSignerUpdateThreshold: MyMultiSigV5.Action {
    pub let threshold: UInt
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address
    pub let timestamp: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV5.Treasury = params["treasury"]! as! &DAOTreasuryV5.Treasury
      let manager = treasuryRef.borrowManager()

      // Update Threshold
      manager.updateThreshold(newThreshold: self.threshold)
      // Remove Signer
      manager.removeSigner(signer: self.signer)
    }

    pub fun getView(): MyMultiSigV5.ActionView {
      let view: MyMultiSigV5.ActionView = TreasuryActionsV5.InitializeActionView(
        type: "RemoveSignerUpdateThreshold",
        intent: self.intent,
        proposer: self.proposer,
        timestamp: self.timestamp
      )
      view.newThreshold = self.threshold
      view.signerAddr = self.signer
      return view
    }

    init(signer: Address, threshold: UInt, proposer: Address) {
      self.signer = signer
      self.threshold = threshold
      self.proposer = proposer
      self.timestamp = getCurrentBlock().timestamp
      self.intent = "Remove signer "
        .concat(signer.toString())
        .concat(". Update the threshold of signers to ")
        .concat(threshold.toString()).concat(".")
    }
  }
}

 