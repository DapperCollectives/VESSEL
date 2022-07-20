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
  pub event DepositTokens(identifier: String)
  pub event DepositNFT(collectionID: String, nftID: UInt64)
  pub event WithdrawTokens(vaultID: String, amount: UFix64)
  pub event WithdrawNFT(collectionID: String, nftID: UInt64)


  // Interfaces + Resources
  pub resource interface TreasuryPublic {
    pub fun proposeAction(action: {MyMultiSig.Action}): UInt64
    pub fun executeAction(actionUUID: UInt64)
    pub fun depositCollection(collection: @NonFungibleToken.Collection)
    pub fun depositTokens(identifier: String, vault: @FungibleToken.Vault)
    pub fun depositNFT(identifier: String, nft: @NonFungibleToken.NFT)
    pub fun borrowManagerPublic(): &MyMultiSig.Manager{MyMultiSig.ManagerPublic}
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance}
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic}
    pub fun getVaultIdentifiers(): [String]
    pub fun getCollectionIdentifiers(): [String]
  }

  pub resource Treasury: MyMultiSig.MultiSign, TreasuryPublic {
    access(contract) let multiSignManager: @MyMultiSig.Manager
    access(self) var vaults: @{String: FungibleToken.Vault}
    access(self) var collections: @{String: NonFungibleToken.Collection}

    // ------- Manager -------   
    pub fun proposeAction(action: {MyMultiSig.Action}): UInt64 {
      let uuid = self.multiSignManager.createMultiSign(action: action)
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
    pub fun executeAction(actionUUID: UInt64) {
      let selfRef: &Treasury = &self as &Treasury
      self.multiSignManager.executeAction(actionUUID: actionUUID, {"treasury": selfRef})
      emit ExecuteAction(actionUUID: actionUUID)
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

    // Public Reference to Vault //
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance} {
      return (&self.vaults[identifier] as &{FungibleToken.Balance}?)!
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
    return <- create Treasury(_initialSigners: initialSigners, _initialThreshold: initialThreshold)
  }

  init() {
    self.TreasuryStoragePath = /storage/DAOTreasury003
    self.TreasuryPublicPath = /public/DAOTreasury003
  }

}