export const GET_PROPOSED_ACTIONS = `
	import DAOTreasury from 0xDAOTreasury

	pub fun main(treasuryAddr: Address): {UInt64: String} {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")

		return treasury.borrowManagerPublic().getIntents()
	}
`;
