import DAOTreasury from "../contracts/DAOTreasury.cdc"
import TreasuryActions from "../contracts/TreasuryActions.cdc"

transaction(newThreshold: UInt64) {
  
  let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}

  prepare(signer: AuthAccount) {
    self.Treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                    ?? panic("Could not borrow the DAOTreasury")
  }
  execute {
    let action = TreasuryActions.UpdateThreshold(newThreshold)
    self.Treasury.proposeAction(action: action)
  }
}