import MyMultiSig from "./MyMultiSig.cdc"
import DAOTreasury from "./DAOTreasury.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract TreasuryActions {

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
      self.recipientTreasury.borrow()!.depositVault(vault: <- withdrawnTokens)
    }

    init(_recipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>, _identifier: String, _amount: UFix64) {
      self.intent = "Transfer "
                        .concat(_amount.toString())
                        .concat(" ")
                        .concat(_identifier)
                        .concat(" tokens from the treasury to ")
                        .concat(_recipientTreasury.borrow()!.owner!.address.toString())
      self.identifier = _identifier
      self.recipientTreasury = _recipientTreasury
      self.amount = _amount
    }
  }

  // Transfers an NFT from the treasury to `recipientCollection`
  pub struct TransferNFT: MyMultiSig.Action {
    pub let intent: String
    pub let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
    pub let withdrawID: UInt64

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury

      let collectionRef: &NonFungibleToken.Collection = treasuryRef.borrowCollection(identifier: self.recipientCollection.borrow()!.getType().identifier)
      let nft <- collectionRef.withdraw(withdrawID: self.withdrawID)
      self.recipientCollection.borrow()!.deposit(token: <- nft)
    }

    init(_recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>, _nftID: UInt64) {
      self.intent = "Transfer a "
                        .concat(_recipientCollection.getType().identifier)
                        .concat(" NFT from the treasury to ")
                        .concat(_recipientCollection.borrow()!.uuid.toString())
      self.recipientCollection = _recipientCollection
      self.withdrawID = _nftID
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
    }

    init(_recipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>, _identifier: String, _nftID: UInt64) {
      self.intent = "Transfer an NFT from collection"
                        .concat(" ")
                        .concat(_identifier)
                        .concat(" with ID ")
                        .concat(_nftID.toString())
                        .concat(" ")
                        .concat(" from this Treasury to Treasury at address ")
                        .concat(_recipientTreasury.borrow()!.owner!.address.toString())
      self.identifier = _identifier
      self.recipientTreasury = _recipientTreasury
      self.withdrawID= _nftID
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
    }

    init(_signer: Address) {
      self.signer = _signer
      self.intent = "Add a signer to the Treasury."
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
    }

    init(_signer: Address) {
      self.signer = _signer
      self.intent = "Remove ".concat((_signer as Address).toString()).concat(" as a signer to the Treasury.")
    }
  }

  // Update the threshold of signers
  pub struct UpdateThreshold: MyMultiSig.Action {
    pub let threshold: UInt64
    pub let intent: String

    access(account) fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &DAOTreasury.Treasury = params["treasury"]! as! &DAOTreasury.Treasury

      let manager = treasuryRef.borrowManager()
      manager.updateThreshold(newThreshold: self.threshold)
    }

    init(_threshold: UInt64) {
      self.threshold = _threshold
      self.intent = "Update the threshold of signers needed to execute an action in the Treasury."
    }
  }
}