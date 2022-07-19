export const REMOVE_SIGNER = `
import DAOTreasury from 0xDAOTreasury
import TreasuryActions from 0xTreasuryActions

transaction(signerToBeRemoved: Address) {
  
  let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}

  prepare(signer: AuthAccount) {
    self.Treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                    ?? panic("Could not borrow the DAOTreasury")
  }
  execute {
    let action = TreasuryActions.RemoveSigner(signerToBeRemoved)
    self.Treasury.proposeAction(action: action)
  }
}
`;
