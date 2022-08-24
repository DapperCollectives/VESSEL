import TreasuryActionsV3 from "../contracts/TreasuryActions.cdc"
import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MyMultiSigV3 from "../contracts/MyMultiSig.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer ZeedzINO with ID `id` from the DAOTreasuryV2
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, id: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
  let recipientTreasury: Capability<&{DAOTreasuryV3.TreasuryPublic}>
  let action: AnyStruct{MyMultiSigV3.Action}
  let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV3 doesn't exist here.")
    self.recipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasuryV3.TreasuryPublic}>(DAOTreasuryV3.TreasuryPublicPath)
    self.action = TreasuryActionsV3.TransferNFTToTreasury(recipientTreasury: self.recipientTreasury, identifier: identifier, nftID: id, proposer: signer.address)
    
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