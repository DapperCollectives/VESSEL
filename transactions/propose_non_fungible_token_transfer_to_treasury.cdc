import TreasuryActionsV2 from "../contracts/TreasuryActions.cdc"
import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MyMultiSigV2 from "../contracts/MyMultiSig.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer ExampleNFT with ID `id` from the DAOTreasuryV2
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, id: UInt64, message: String, messageHex: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
  let recipientTreasury: Capability<&{DAOTreasuryV2.TreasuryPublic}>
  let action: AnyStruct{MyMultiSigV2.Action}
  let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")
    self.recipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasuryV2.TreasuryPublic}>(DAOTreasuryV2.TreasuryPublicPath)
    self.action = TreasuryActionsV2.TransferNFTToTreasury(recipientTreasury: self.recipientTreasury, identifier: identifier, nftID: id, proposer: signer.address)
    
    var _keyIds: [Int] = []

    for keyId in keyIds {
        _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
        signingAddr: signer.address, message: message, messageHex: messageHex, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )
  }
  execute {
    self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
  }
}