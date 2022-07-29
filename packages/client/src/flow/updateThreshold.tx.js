export const UPDATE_THRESHOLD = `
	import DAOTreasury from 0xDAOTreasury
  import TreasuryActions from 0xTreasuryActions
  import MyMultiSig from 0xMyMultiSig

  transaction(treasuryAddr: Address, newThreshold: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
    let treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
    let action: AnyStruct{MyMultiSig.Action}
    let messageSignaturePayload: MyMultiSig.MessageSignaturePayload
  
    prepare(signer: AuthAccount) {
          self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                      .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                      ?? panic("A DAOTreasury doesn't exist here.")
      self.action = TreasuryActions.UpdateThreshold(newThreshold, signer.address)
  
      var _keyIds: [Int] = []
  
      for keyId in keyIds {
          _keyIds.append(Int(keyId))
      }
  
      self.messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
          _signingAddr: signer.address, _message: message, _keyIds: _keyIds, _signatures: signatures, _signatureBlock: signatureBlock
      )
    }
    execute {
      self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
    }
  }
`;
