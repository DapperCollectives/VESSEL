import DAOTreasury from "../contracts/DAOTreasury.cdc"
import TreasuryActions from "../contracts/TreasuryActions.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"

transaction(signerToBeRemoved: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
  let treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let action: AnyStruct{MyMultiSig.Action}
  let messageSignaturePayload: MyMultiSig.MessageSignaturePayload

  prepare(signer: AuthAccount) {
    self.treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                    ?? panic("Could not borrow the DAOTreasury")
    self.action = TreasuryActions.RemoveSigner(signerToBeRemoved, signer.address)
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