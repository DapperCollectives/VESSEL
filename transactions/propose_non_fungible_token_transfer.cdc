import TreasuryActions from "../contracts/TreasuryActions.cdc"
import DAOTreasury from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer ExampleNFT with ID `id` from the DAOTreasury
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, id: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
  let action: AnyStruct{MyMultiSig.Action}
  let messageSignaturePayload: MyMultiSig.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.recipientCollection = getAccount(recipientAddr).getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
    self.action = TreasuryActions.TransferNFT(_recipientCollection: self.recipientCollection, _nftID: id, _proposer: signer.address)
    
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