export const GET_VAULT_BALANCE = `
	import DAOTreasuryV5 from 0xDAOTreasuryV5
	import FungibleToken from 0xFungibleToken

	pub fun main(treasuryAddr: Address, vaultId: String): UFix64 {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
											.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
											?? panic("A DAOTreasuryV5 doesn't exist here.")

		let vault: &{FungibleToken.Balance} = treasury.borrowVaultPublic(identifier: vaultId)
		return vault.balance
	}
`;
