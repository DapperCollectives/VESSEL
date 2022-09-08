import TreasuryActionsV4 from "../contracts/TreasuryActions.cdc"
import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MyMultiSigV4 from "../contracts/MyMultiSig.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer ZeedzINO with ID `id` from the DAOTreasuryV4
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, id: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}
  let recipientTreasury: Capability<&{DAOTreasuryV4.TreasuryPublic}>
  let action: AnyStruct{MyMultiSigV4.Action}
  let messageSignaturePayload: MyMultiSigV4.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")
    self.recipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasuryV4.TreasuryPublic}>(DAOTreasuryV4.TreasuryPublicPath)
    self.action = TreasuryActionsV4.TransferNFTToTreasury(recipientTreasury: self.recipientTreasury, identifier: identifier, nftID: id, proposer: signer.address)
    
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