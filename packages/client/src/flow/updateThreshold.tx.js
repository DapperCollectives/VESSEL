export const UPDATE_THRESHOLD = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2
  import TreasuryActionsV2 from 0xTreasuryActionsV2
  import MyMultiSigV2 from 0xMyMultiSigV2

  transaction(treasuryAddr: Address, newThreshold: Int, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
    let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
    let action: AnyStruct{MyMultiSigV2.Action}
    let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload
  
    prepare(signer: AuthAccount) {
      self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                      .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                      ?? panic("A DAOTreasuryV2 doesn't exist here.")
      self.action = TreasuryActionsV2.UpdateThreshold(threshold: newThreshold, proposer: signer.address)
  
      var _keyIds: [Int] = []
  
      for keyId in keyIds {
          _keyIds.append(Int(keyId))
      }
  
      self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
        signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
      )
    }
    execute {
      self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
    }
  }
`;
