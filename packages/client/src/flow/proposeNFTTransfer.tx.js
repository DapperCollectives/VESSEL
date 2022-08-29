export const PROPOSE_NFT_TRANSFER = `
	import TreasuryActionsV3 from 0xTreasuryActionsV3
	import DAOTreasuryV3 from 0xDAOTreasuryV3
	import NonFungibleToken from 0xNonFungibleToken
	import MyMultiSigV3 from 0xMyMultiSigV3
	import ExampleNFT from 0xExampleNFT
	
	transaction(treasuryAddr: Address, recipientAddr: Address, id: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
	
	  let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
	  let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
	  let action: AnyStruct{MyMultiSigV3.Action}
	  let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload
	  
	  prepare(signer: AuthAccount) {
		self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
						.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
						?? panic("A DAOTreasuryV3 doesn't exist here.")
		self.recipientCollection = getAccount(recipientAddr).getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
		self.action = TreasuryActionsV3.TransferNFT(recipientCollection: self.recipientCollection, nftID: id, proposer: signer.address)
		
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
`;
