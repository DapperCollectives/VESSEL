export const UPDATE_SIGNER = `
  import DAOTreasuryV4 from 0xDAOTreasuryV4

  transaction(oldSignerAddress: Address, newSignerAddress: Address) {

    prepare(signer: AuthAccount) {
      let treasury = signer.borrow<&DAOTreasuryV4.Treasury>(from: DAOTreasuryV4.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasuryV4")
      let manager = treasury.borrowManager()

      manager.removeSigner(signer: oldSignerAddress)
      manager.addSigner(signer: newSignerAddress)
    }
  }
`;
