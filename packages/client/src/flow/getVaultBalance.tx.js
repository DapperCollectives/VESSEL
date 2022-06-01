export const GET_VAULT_BALANCE = `
	import DAOTreasury from 0xDAOTreasury
	import FungibleToken from 0xFungibleToken

	pub fun main(treasuryAddr: Address, vaultId: String): UFix64 {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")

		// let identifier: String = "A.7e60df042a9c0868.FlowToken.Vault"
		let vault: &{FungibleToken.Receiver, FungibleToken.Balance} = treasury.borrowVaultPublic(identifier: vaultId)
		return vault.balance
	}
`;
