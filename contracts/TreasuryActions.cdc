import MyMultiSig from "./MyMultiSig.cdc"
import DAOTreasury from "./DAOTreasury.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract TreasuryActions {

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

  // Transfers `amount` tokens from the treasury to `recipientVault`
  pub struct TransferToken: MyMultiSig.Action {
    pub let intent: String
    pub let recipientVault: Capability<&{FungibleToken.Receiver}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury
      let vaultRef: &FungibleToken.Vault = treasuryRef.borrowVault(identifier: self.recipientVault.borrow()!.getType().identifier)
      let withdrawnTokens <- vaultRef.withdraw(amount: self.amount)
      self.recipientVault.borrow()!.deposit(from: <- withdrawnTokens)

      emit TransferTokenToAccountActionExecuted(
        recipientAddr: self.recipientVault.borrow()!.owner!.address,
        vaultID: self.recipientVault.getType().identifier,
        amount: self.amount,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientVault: Capability<&{FungibleToken.Receiver}>, _amount: UFix64) {
      self.intent = "Transfer "
                        .concat(_amount.toString())
                        .concat(" ")
                        .concat(_recipientVault.getType().identifier)
                        .concat(" tokens from the treasury to ")
                        .concat(_recipientVault.borrow()!.owner!.address.toString())
      self.recipientVault = _recipientVault
      self.amount = _amount

      emit TransferTokenToAccountActionCreated(
        recipientAddr: _recipientVault.borrow()!.owner!.address,
        vaultID: _recipientVault.getType().identifier,
        amount: _amount
      )
    }
  }

  // Transfers `amount` of `identifier` tokens from the treasury to another treasury
  pub struct TransferTokenToTreasury: MyMultiSig.Action {
    pub let intent: String
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>
    pub let amount: UFix64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury
      let vaultRef: &FungibleToken.Vault = treasuryRef.borrowVault(identifier: self.identifier)
      let withdrawnTokens <- vaultRef.withdraw(amount: self.amount)
      let recipientAddr = self.recipientTreasury.borrow()!.owner!.address
      self.recipientTreasury.borrow()!.depositVault(vault: <- withdrawnTokens)

      emit TransferTokenToTreasuryActionExecuted(
        recipientAddr: recipientAddr,
        vaultID: self.identifier,
        amount: self.amount,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>, _identifier: String, _amount: UFix64) {
      let recipientAddr = _recipientTreasury.borrow()!.owner!.address
      self.intent = "Transfer "
                        .concat(_amount.toString())
                        .concat(" ")
                        .concat(_identifier)
                        .concat(" tokens from the treasury to ")
                        .concat(recipientAddr.toString())
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
  pub struct TransferNFT: MyMultiSig.Action {
    pub let intent: String
    pub let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury
      let collectionID = self.recipientCollection.borrow()!.getType().identifier
      let collectionRef: &NonFungibleToken.Collection = treasuryRef.borrowCollection(identifier: collectionID)
      let nft <- collectionRef.withdraw(withdrawID: self.withdrawID)
      self.recipientCollection.borrow()!.deposit(token: <- nft)

      emit TransferNFTToAccountActionExecuted(
        recipientAddr: self.recipientCollection.borrow()!.owner!.address,
        collectionID: collectionID,
        nftID: self.withdrawID,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>, _nftID: UInt64) {
      let recipientAddr = _recipientCollection.borrow()!.owner!.address
      let collectionID = _recipientCollection.getType().identifier

      self.intent = "Transfer a "
                        .concat(collectionID)
                        .concat(" NFT from the treasury to ")
                        .concat(recipientAddr.toString())
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
  pub struct TransferNFTToTreasury: MyMultiSig.Action {
    pub let intent: String
    pub let identifier: String
    pub let recipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury
      let collectionRef: &NonFungibleToken.Collection = treasuryRef.borrowCollection(identifier: self.identifier)
      let nft <- collectionRef.withdraw(withdrawID: self.withdrawID)

      let recipientCollectionRef: &{NonFungibleToken.CollectionPublic} = self.recipientTreasury.borrow()!.borrowCollectionPublic(identifier: self.identifier)
      recipientCollectionRef.deposit(token: <- nft)

      emit TransferNFTToTreasuryActionExecuted(
        recipientAddr: self.recipientTreasury.borrow()!.owner!.address,
        collectionID: self.identifier,
        nftID: self.withdrawID,
        treasuryAddr: treasuryRef.owner!.address
      )
    }

    init(_recipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>, _identifier: String, _nftID: UInt64) {
      let recipientAddr = _recipientTreasury.borrow()!.owner!.address
      self.intent = "Transfer an NFT from collection"
                        .concat(" ")
                        .concat(_identifier)
                        .concat(" with ID ")
                        .concat(_nftID.toString())
                        .concat(" ")
                        .concat(" from this Treasury to Treasury at address ")
                        .concat(recipientAddr.toString())
      self.identifier = _identifier
      self.recipientTreasury = _recipientTreasury
      self.withdrawID= _nftID

      emit TransferNFTToTreasuryActionCreated(
        recipientAddr: recipientAddr,
        collectionID: _identifier,
        nftID: _nftID
      )
    }
  }

  // Add a new signer to the treasury
  pub struct AddSigner: MyMultiSig.Action {
    pub let signer: Address
    pub let intent: String

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury

      let manager = treasuryRef.borrowManager()
      manager.addSigner(signer: self.signer)

      emit AddSignerActionExecuted(address: self.signer, treasuryAddr: treasuryRef.owner!.address)
    }

    init(_signer: Address) {
      self.signer = _signer
      self.intent = "Add a signer to the Treasury."
      emit AddSignerActionCreated(address: _signer)
    }
  }

  // Remove a signer from the treasury
  pub struct RemoveSigner: MyMultiSig.Action {
    pub let signer: Address
    pub let intent: String

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury

      let manager = treasuryRef.borrowManager()
      manager.removeSigner(signer: self.signer)
      emit RemoveSignerActionExecuted(address: self.signer, treasuryAddr: treasuryRef.owner!.address)
    }

    init(_signer: Address) {
      self.signer = _signer
      self.intent = "Remove ".concat((_signer as Address).toString()).concat(" as a signer to the Treasury.")
      emit RemoveSignerActionCreated(address: _signer)
    }
  }

  // Update the threshold of signers
  pub struct UpdateThreshold: MyMultiSig.Action {
    pub let threshold: UInt64
    pub let intent: String

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury

      let manager = treasuryRef.borrowManager()
      let oldThreshold = manager.threshold
      manager.updateThreshold(newThreshold: self.threshold)
      emit UpdateThresholdActionExecuted(oldThreshold: oldThreshold, newThreshold: self.threshold, treasuryAddr: treasuryRef.owner!.address)
    }

    init(_threshold: UInt64) {
      self.threshold = _threshold
      self.intent = "Update the threshold of signers needed to execute an action in the Treasury."
      emit UpdateThresholdActionCreated(threshold: _threshold)
    }
  }
}