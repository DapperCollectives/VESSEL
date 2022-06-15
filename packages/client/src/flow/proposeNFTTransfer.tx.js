export const PROPOSE_NFT_TRANSFER = `
	import TreasuryActions from 0xTreasuryActions
	import DAOTreasury from 0xDAOTreasury
	import NonFungibleToken from 0xNonFungibleToken
	import MyMultiSig from 0xMyMultiSig
	import ExampleNFT from 0xExampleNFT

	transaction(treasuryAddr: Address, recipientAddr: Address, id: UInt64) {

		let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
		let RecipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
		
		prepare(signer: AuthAccount) {
			self.Treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")
			self.RecipientCollection = getAccount(recipientAddr).getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
		}
		execute {
			let action = TreasuryActions.TransferNFT(_recipientCollection: self.RecipientCollection, _nftID: id)
			self.Treasury.proposeAction(action: action)
		}
	}
`;
