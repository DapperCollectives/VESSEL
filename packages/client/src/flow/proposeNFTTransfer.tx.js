export const PROPOSE_NFT_TRANSFER = `
	import TreasuryActions from 0xTreasuryActions
	import DAOTreasury from 0xDAOTreasury
	import NonFungibleToken from 0xNonFungibleToken
	import MyMultiSig from 0xMyMultiSig
	import ExampleNFT from 0xExampleNFT
	
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
		self.action = TreasuryActions.TransferNFT(recipientCollection: self.recipientCollection, nftID: id, proposer: signer.address)
		
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
