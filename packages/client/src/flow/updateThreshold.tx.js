export const UPDATE_THRESHOLD = `
	import DAOTreasury from 0xDAOTreasury
  import TreasuryActions from 0xTreasuryActions

	transaction(newThreshold: UInt64) {
  
    let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  
    prepare(signer: AuthAccount) {
      self.Treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasury")
    }
    execute {
      let action = TreasuryActions.UpdateThreshold(_threshold: newThreshold)
      self.Treasury.proposeAction(action: action)
    }
  }
`;
