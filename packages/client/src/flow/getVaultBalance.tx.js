export const GET_VAULT_BALANCE = `
	import DAOTreasuryV3 from 0xDAOTreasuryV3
	import FungibleToken from 0xFungibleToken

	pub fun main(treasuryAddr: Address, vaultId: String): UFix64 {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
											.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
											?? panic("A DAOTreasuryV3 doesn't exist here.")

		let vault: &{FungibleToken.Balance} = treasury.borrowVaultPublic(identifier: vaultId)
		return vault.balance
	}
`;
