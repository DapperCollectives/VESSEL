export const UPDATE_THRESHOLD = `
	import DAOTreasuryV3 from 0xDAOTreasuryV3
  import TreasuryActionsV3 from 0xTreasuryActionsV3
  import MyMultiSigV3 from 0xMyMultiSigV3

  transaction(treasuryAddr: Address, newThreshold: UInt, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
    let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
    let action: AnyStruct{MyMultiSigV3.Action}
    let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload
  
    prepare(signer: AuthAccount) {
      self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                      .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                      ?? panic("A DAOTreasuryV3 doesn't exist here.")
      self.action = TreasuryActionsV3.UpdateThreshold(threshold: newThreshold, proposer: signer.address)
  
      var _keyIds: [Int] = []
  
      for keyId in keyIds {
          _keyIds.append(Int(keyId))
      }
  
      self.messageSignaturePayload = MyMultiSigV3.MessageSignaturePayload(
        signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
      )
    }
    execute {
      self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
    }
  }
`;
