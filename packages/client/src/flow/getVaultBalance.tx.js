export const GET_VAULT_BALANCE = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import FungibleToken from 0xFungibleToken

	pub fun main(treasuryAddr: Address, vaultId: String): UFix64 {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
											.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
											?? panic("A DAOTreasuryV2 doesn't exist here.")

		let vault: &{FungibleToken.Balance} = treasury.borrowVaultPublic(identifier: vaultId)
		return vault.balance
	}
`;
