export const ADD_SIGNER = `
  import DAOTreasury from 0xDAOTreasury
  import TreasuryActions from 0xTreasuryActions

  transaction(additionalSigner: Address) {
  
    let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  
    prepare(signer: AuthAccount) {
      self.Treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasury")
    }
    execute {
      let action = TreasuryActions.AddSigner(additionalSigner)
      self.Treasury.proposeAction(action: action)
    }
  }
`;
