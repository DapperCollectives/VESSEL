export const PROPOSE_NFT_TRANSFER = (contractName, contractAddress) => `
	import TreasuryActionsV5 from 0xTreasuryActionsV5
	import DAOTreasuryV5 from 0xDAOTreasuryV5
	import NonFungibleToken from 0xNonFungibleToken
	import MyMultiSigV5 from 0xMyMultiSigV5
	import ${contractName} from ${contractAddress}
	
	transaction(treasuryAddr: Address, recipientAddr: Address, id: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
	
	  let treasury: &DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}
	  let recipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
	  let action: AnyStruct{MyMultiSigV5.Action}
	  let messageSignaturePayload: MyMultiSigV5.MessageSignaturePayload
	  
	  prepare(signer: AuthAccount) {
		self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
						.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
						?? panic("A DAOTreasuryV5 doesn't exist here.")
		self.recipientCollection = getAccount(recipientAddr).getCapability<&{NonFungibleToken.CollectionPublic}>(${contractName}.CollectionPublicPath)
		self.action = TreasuryActionsV5.TransferNFT(recipientCollection: self.recipientCollection, nftID: id, proposer: signer.address)
		
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
`;
