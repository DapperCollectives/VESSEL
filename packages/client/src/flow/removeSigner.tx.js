export const REMOVE_SIGNER = `
import DAOTreasury from 0xDAOTreasury
import TreasuryActions from 0xTreasuryActions
import MyMultiSig from 0xMyMultiSig

transaction(signerToBeRemoved: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
  let treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let action: AnyStruct{MyMultiSig.Action}
  let messageSignaturePayload: MyMultiSig.MessageSignaturePayload

  prepare(signer: AuthAccount) {
    self.treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                    ?? panic("Could not borrow the DAOTreasury")
    self.action = TreasuryActions.RemoveSigner(signer: signerToBeRemoved, proposer: signer.address)
    var _keyIds: [Int] = []

    for keyId in keyIds {
        _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
      signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )
  }
  execute {
    self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
  }
}
`;
