export const UPDATE_SIGNER = `
  import DAOTreasuryV3 from 0xDAOTreasuryV3

  transaction(oldSignerAddress: Address, newSignerAddress: Address) {

    prepare(signer: AuthAccount) {
      let treasury = signer.borrow<&DAOTreasuryV3.Treasury>(from: DAOTreasuryV3.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasuryV3")
      let manager = treasury.borrowManager()

      manager.removeSigner(signer: oldSignerAddress)
      manager.addSigner(signer: newSignerAddress)
    }
  }
`;
