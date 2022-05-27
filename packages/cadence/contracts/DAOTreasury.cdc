import MyMultiSig from "./MyMultiSig.cdc"
import FungibleToken from "./core/FungibleToken.cdc"
import NonFungibleToken from "./core/NonFungibleToken.cdc"

pub contract DAOTreasury {

  pub let TreasuryStoragePath: StoragePath
  pub let TreasuryPublicPath: PublicPath

  pub resource interface TreasuryPublic {
    pub fun proposeAction(action: {MyMultiSig.Action}): UInt64
    pub fun executeAction(actionUUID: UInt64)
    pub fun depositVault(vault: @FungibleToken.Vault)
    pub fun depositCollection(collection: @NonFungibleToken.Collection)
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
    }

    // Reference to Manager //
    pub fun borrowManager(): &MyMultiSig.Manager {
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
    }

    // Withdraw some tokens //
    pub fun withdrawTokens(identifier: String, amount: UFix64): @FungibleToken.Vault {
      let vaultRef = &self.vaults[identifier] as &FungibleToken.Vault
      return <- vaultRef.withdraw(amount: amount)
    }

    // Reference to Vault //
    pub fun borrowVault(identifier: String): &FungibleToken.Vault {
      return &self.vaults[identifier] as &FungibleToken.Vault
    }

    // Public Reference to Vault //
    pub fun borrowVaultPublic(identifier: String): &{FungibleToken.Balance, FungibleToken.Receiver} {
      return &self.vaults[identifier] as &{FungibleToken.Balance, FungibleToken.Receiver}
    }

    pub fun getVaultIdentifiers(): [String] {
      return self.vaults.keys
    }


    // ------- Collections ------- 

    // Deposit a Collection //
    pub fun depositCollection(collection: @NonFungibleToken.Collection) {
      self.collections[collection.getType().identifier] <-! collection
    }

    // pub fun depositNFT(nft: @NonFungibleToken.NFT, collectionIdentifier: String) {
    //   let collectionRef =  &self.collections[collectionIdentifier]
    //   collectionRef.deposit(token: <- nft)
    // }

    // TODO: Figure out how to deposit individual NFTs

    // Withdraw an NFT //
    pub fun withdrawNFT(identifier: String, id: UInt64): @NonFungibleToken.NFT {
      let collectionRef = &self.collections[identifier] as &NonFungibleToken.Collection
      return <- collectionRef.withdraw(withdrawID: id)
    }

    // Reference to Collection //
    pub fun borrowCollection(identifier: String): &NonFungibleToken.Collection {
      return &self.collections[identifier] as &NonFungibleToken.Collection
    }

    // Public Reference to Collection //
    pub fun borrowCollectionPublic(identifier: String): &{NonFungibleToken.CollectionPublic} {
      return &self.collections[identifier] as &{NonFungibleToken.CollectionPublic}
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