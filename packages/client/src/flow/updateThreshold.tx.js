export const UPDATE_THRESHOLD = `
	import DAOTreasury from 0xDAOTreasury

	transaction(newThreshold: UInt64) {

    prepare(signer: AuthAccount) {
      let treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasury")
      let manager = treasury.borrowManager()

      manager.updateThreshold(newThreshold: newThreshold)
    }
  }
`;
