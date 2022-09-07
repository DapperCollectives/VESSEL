export const ADD_SIGNER = `
  import DAOTreasuryV4 from 0xDAOTreasuryV4
  import TreasuryActionsV4 from 0xTreasuryActionsV4
  import MyMultiSigV4 from 0xMyMultiSigV4

  transaction(treasuryAddr: Address, additionalSigner: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
    let treasury: &DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}
    let action: AnyStruct{MyMultiSigV4.Action}
    let messageSignaturePayload: MyMultiSigV4.MessageSignaturePayload
  
    prepare(signer: AuthAccount) {
      self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                      .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                      ?? panic("A DAOTreasuryV4 doesn't exist here.")
      self.action = TreasuryActionsV4.AddSigner(signer: additionalSigner, proposer: signer.address)
      
      var _keyIds: [Int] = []
  
      for keyId in keyIds {
          _keyIds.append(Int(keyId))
      }
  
      self.messageSignaturePayload = MyMultiSigV4.MessageSignaturePayload(
          signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
      )
    }
    execute {
      self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
    }
  }
`;
