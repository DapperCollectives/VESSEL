export const GET_PROPOSED_ACTIONS = `
	import DAOTreasuryV3 from 0xDAOTreasuryV3

	pub fun main(treasuryAddr: Address): {UInt64: String} {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
											.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
											?? panic("A DAOTreasuryV3 doesn't exist here.")

		return treasury.borrowManagerPublic().getIntents()
	}
`;
