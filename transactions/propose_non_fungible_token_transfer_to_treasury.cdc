import TreasuryActionsV5 from "../contracts/TreasuryActions.cdc"
import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MyMultiSigV5 from "../contracts/MyMultiSig.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer ZeedzINO with ID `id` from the DAOTreasuryV5
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, id: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}
  let recipientTreasury: Capability<&{DAOTreasuryV5.TreasuryPublic}>
  let action: AnyStruct{MyMultiSigV5.Action}
  let messageSignaturePayload: MyMultiSigV5.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV5 doesn't exist here.")
    self.recipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasuryV5.TreasuryPublic}>(DAOTreasuryV5.TreasuryPublicPath)
    self.action = TreasuryActionsV5.TransferNFTToTreasury(recipientTreasury: self.recipientTreasury, identifier: identifier, nftID: id, proposer: signer.address)
    
    var _keyIds: [Int] = []

    for keyId in keyIds {
        _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV5.MessageSignaturePayload(
        signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )
  }
  execute {
    self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
  }
}