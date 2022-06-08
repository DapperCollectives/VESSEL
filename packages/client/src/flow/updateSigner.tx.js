export const UPDATE_SIGNER = `
  import DAOTreasury from 0xDAOTreasury

  transaction(oldSignerAddress: Address, newSignerAddress: Address) {

    prepare(signer: AuthAccount) {
      let treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasury")
      let manager = treasury.borrowManager()

      manager.removeSigner(signer: oldSignerAddress)
      manager.addSigner(signer: newSignerAddress)
    }
  }
`;
