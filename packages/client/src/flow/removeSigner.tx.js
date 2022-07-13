export const REMOVE_SIGNER = `
  import DAOTreasury from 0xDAOTreasury

  transaction(signerToBeRemoved: Address) {

    prepare(signer: AuthAccount) {
      let treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasury")
      let manager = treasury.borrowManager()

      manager.removeSigner(signer: signerToBeRemoved)
    }
  }
`;
