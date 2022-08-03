export const UPDATE_SIGNER = `
  import DAOTreasuryV2 from 0xDAOTreasuryV2

  transaction(oldSignerAddress: Address, newSignerAddress: Address) {

    prepare(signer: AuthAccount) {
      let treasury = signer.borrow<&DAOTreasuryV2.Treasury>(from: DAOTreasuryV2.TreasuryStoragePath)
                      ?? panic("Could not borrow the DAOTreasuryV2")
      let manager = treasury.borrowManager()

      manager.removeSigner(signer: oldSignerAddress)
      manager.addSigner(signer: newSignerAddress)
    }
  }
`;
