import MyMultiSigV3 from "./MyMultiSig.cdc"
import DAOTreasuryV3 from "./DAOTreasury.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract TreasuryActionsV3 {

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
  pub event UpdateThresholdActionCreated(threshold: UInt)
  pub event UpdateThresholdActionExecuted(oldThreshold: UInt, newThreshold: UInt, treasuryAddr: Address)

  // Destroy Action
  pub event DestroyActionActionCreated(actionUUID: UInt64)
  pub event DestroyActionActionExecuted(actionUUID: UInt64, treasuryAddr: Address)

  // Transfers `amount` tokens from the treasury to `recipientVault`
  pub struct TransferToken: MyMultiSigV3.Action {
    pub let intent: String
    pub let proposer: Address
    pub let recipientVault: Capability<&{FungibleToken.Receiver}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV3.Treasury = params["treasury"]! as! &DAOTreasuryV3.Treasury
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

    pub fun getView(): MyMultiSigV3.ActionView {
      return MyMultiSigV3.ActionView(
        name: "Transfer Tokens",
        type: "TransferToken",
        intent: self.intent,
        proposer: self.proposer,
        recipient: self.recipientVault.borrow()!.owner!.address,
        vaultId: self.recipientVault.borrow()!.getType().identifier,
        collectionId: nil,
        nftId: nil,
        tokenAmount : self.amount,
        signerAddr: nil,
        newThreshold: nil
      )
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
    }
  }

  // Transfers `amount` of `identifier` tokens from the treasury to another treasury
  pub struct TransferTokenToTreasury: MyMultiSigV3.Action {
    pub let intent: String
    pub let proposer: Address
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasuryV3.TreasuryPublic}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV3.Treasury = params["treasury"]! as! &DAOTreasuryV3.Treasury
      let withdrawnTokens <- treasuryRef.withdrawTokens(identifier: self.identifier, amount: self.amount)

      let recipientAddr = self.recipientTreasury.borrow()!.owner!.address
      self.recipientTreasury.borrow()!.depositTokens(identifier: self.identifier, vault: <- withdrawnTokens)
    }

    pub fun getView(): MyMultiSigV3.ActionView {
      return MyMultiSigV3.ActionView(
        name: "Transfer Tokens",
        type: "TransferTokenToTreasury",
        intent: self.intent,
        proposer: self.proposer,
        recipient: self.recipientTreasury.borrow()!.owner!.address,
        vaultId: self.identifier,
        collectionId: nil,
        nftId: nil,
        tokenAmount : self.amount,
        signerAddr: nil,
        newThreshold: nil
      )
    }

    init(recipientTreasury: Capability<&{DAOTreasuryV3.TreasuryPublic}>, identifier: String, amount: UFix64, proposer: Address) {
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
      self.identifier = identifier
      self.recipientTreasury = recipientTreasury
      self.amount = amount

      emit TransferTokenToTreasuryActionCreated(
        recipientAddr: recipientAddr,
        vaultID: identifier,
        amount: amount
      )
    }
  }

  // Transfers an NFT from the treasury to `recipientCollection`
  pub struct TransferNFT: MyMultiSigV3.Action {
    pub let intent: String
    pub let proposer: Address
    pub let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV3.Treasury = params["treasury"]! as! &DAOTreasuryV3.Treasury
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

    pub fun getView(): MyMultiSigV3.ActionView {
       
      return MyMultiSigV3.ActionView(
        name: "Transfer NFT",
        type: "TransferNFT",
        intent: self.intent,
        proposer: self.proposer,
        recipient: self.recipientCollection.borrow()!.owner!.address,
        vaultId: nil,
        collectionId: self.recipientCollection.borrow()!.getType().identifier,
        nftId: self.withdrawID,
        tokenAmount: nil,
        signerAddr: nil,
        newThreshold: nil
      )
    }

    init(recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>, nftID: UInt64, proposer: Address) {
      let recipientAddr = recipientCollection.borrow()!.owner!.address
      let collectionID = recipientCollection.borrow()!.getType().identifier

      self.intent = "Transfer "
                        .concat(collectionID)
                        .concat(" NFT from the treasury to ")
                        .concat(recipientAddr.toString())

      self.proposer = proposer
      self.recipientCollection = recipientCollection
      self.withdrawID = nftID
      emit TransferNFTToAccountActionCreated(
        recipientAddr: recipientAddr,
        collectionID: collectionID,
        nftID: nftID
      )
    }
  }

  // Transfers an NFT from the treasury to another treasury
  pub struct TransferNFTToTreasury: MyMultiSigV3.Action {
    pub let intent: String
    pub let proposer: Address
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasuryV3.TreasuryPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV3.Treasury = params["treasury"]! as! &DAOTreasuryV3.Treasury
      let nft <- treasuryRef.withdrawNFT(identifier: self.identifier, id: self.withdrawID)

      let recipientCollectionRef: &{NonFungibleToken.CollectionPublic} = self.recipientTreasury.borrow()!.borrowCollectionPublic(identifier: self.identifier)
      recipientCollectionRef.deposit(token: <- nft)
    }

    pub fun getView(): MyMultiSigV3.ActionView {
      return MyMultiSigV3.ActionView(
        name: "Transfer NFT",
        type: "TransferNFTToTreasury",
        intent: self.intent,
        proposer: self.proposer,
        recipient: self.recipientTreasury.borrow()!.owner!.address,
        vaultId: nil,
        collectionId: self.identifier,
        nftId: self.withdrawID,
        tokenAmount: nil,
        signerAddr: nil,
        newThreshold: nil
      )
    }

    init(recipientTreasury: Capability<&{DAOTreasuryV3.TreasuryPublic}>, identifier: String, nftID: UInt64, proposer: Address) {
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

      emit TransferNFTToTreasuryActionCreated(
        recipientAddr: recipientAddr,
        collectionID: identifier,
        nftID: nftID
      )
    }
  }

  // Add a new signer to the treasury
  pub struct AddSigner: MyMultiSigV3.Action {
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV3.Treasury = params["treasury"]! as! &DAOTreasuryV3.Treasury

      let manager = treasuryRef.borrowManager()
      manager.addSigner(signer: self.signer)

      emit AddSignerActionExecuted(address: self.signer, treasuryAddr: treasuryRef.owner!.address)
    }

    pub fun getView(): MyMultiSigV3.ActionView {
      return MyMultiSigV3.ActionView(
        name: "Add Owner",
        type: "AddSigner",
        intent: self.intent,
        proposer: self.proposer,
        recipient: nil,
        vaultId: nil,
        collectionId: nil,
        nftId: nil,
        tokenAmount: nil,
        signerAddr: self.signer,
        newThreshold: nil
      )
    }

    init(signer: Address, proposer: Address) {
      self.proposer = proposer
      self.signer = signer
      self.intent = "Add account "
                      .concat(signer.toString())
                      .concat(" as a signer.")
      emit AddSignerActionCreated(address: signer)
    }
  }

  // Remove a signer from the treasury
  pub struct RemoveSigner: MyMultiSigV3.Action {
    pub let signer: Address
    pub let intent: String
    pub let proposer: Address

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV3.Treasury = params["treasury"]! as! &DAOTreasuryV3.Treasury

      let manager = treasuryRef.borrowManager()
      manager.removeSigner(signer: self.signer)
    }

    pub fun getView(): MyMultiSigV3.ActionView {
      return MyMultiSigV3.ActionView(
        name: "Remove Owner",
        type: "RemoveSigner",
        intent: self.intent,
        proposer: self.proposer,
        recipient: nil,
        vaultId: nil,
        collectionId: nil,
        nftId: nil,
        tokenAmount: nil,
        signerAddr: self.signer,
        newThreshold: nil
      )
    }

    init(signer: Address, proposer: Address) {
      self.proposer = proposer
      self.signer = signer
      self.intent = "Remove "
                      .concat(signer.toString())
                      .concat(" as a signer.")
      emit RemoveSignerActionCreated(address: signer)
    }
  }

  // Update the threshold of signers
  pub struct UpdateThreshold: MyMultiSigV3.Action {
    pub let threshold: UInt
    pub let intent: String
    pub let proposer: Address

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasuryV3.Treasury = params["treasury"]! as! &DAOTreasuryV3.Treasury

      let manager = treasuryRef.borrowManager()
      let oldThreshold = manager.threshold
      manager.updateThreshold(newThreshold: self.threshold)
    }

    pub fun getView(): MyMultiSigV3.ActionView {
      return MyMultiSigV3.ActionView(
        name: "Update Threshold",
        type: "UpdateThreshold",
        intent: self.intent,
        proposer: self.proposer,
        recipient: nil,
        vaultId: nil,
        collectionId: nil,
        nftId: nil,
        tokenAmount: nil,
        signerAddr: nil,
        newThreshold: self.threshold
      )
    }

    init(threshold: UInt, proposer: Address) {
      self.threshold = threshold
      self.proposer = proposer
      self.intent = "Update the threshold of signers to ".concat(threshold.toString()).concat(".")
      emit UpdateThresholdActionCreated(threshold: threshold)
    }
  }
}