export const PROPOSE_NFT_TRANSFER = `
	import TreasuryActionsV2 from 0xTreasuryActionsV2
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import NonFungibleToken from 0xNonFungibleToken
	import MyMultiSigV2 from 0xMyMultiSigV2
	import ExampleNFT from 0xExampleNFT
	
	transaction(treasuryAddr: Address, recipientAddr: Address, id: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
	
	  let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
	  let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
	  let action: AnyStruct{MyMultiSigV2.Action}
	  let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload
	  
	  prepare(signer: AuthAccount) {
		self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
						.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
						?? panic("A DAOTreasuryV2 doesn't exist here.")
		self.recipientCollection = getAccount(recipientAddr).getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
		self.action = TreasuryActionsV2.TransferNFT(_recipientCollection: self.recipientCollection, _nftID: id, _proposer: signer.address)
		
		var _keyIds: [Int] = []
	
		for keyId in keyIds {
			_keyIds.append(Int(keyId))
		}
	
		self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
			_signingAddr: signer.address, _message: message, _keyIds: _keyIds, _signatures: signatures, _signatureBlock: signatureBlock
		)
	  }
	  execute {
		self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
	  }
	}
`;
