const treasury = `
	let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
										.borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
										?? panic("A DAOTreasuryV4 doesn't exist here.")
`;

export const GET_SIGNERS = `
	import DAOTreasuryV4 from 0xDAOTreasuryV4
	pub fun main(treasuryAddr: Address): {Address: Bool} {
		${treasury}
		return treasury.borrowManagerPublic().getSigners()
	}
`;

export const GET_THRESHOLD = `
	import DAOTreasuryV4 from 0xDAOTreasuryV4

	pub fun main(treasuryAddr: Address): UInt {
		${treasury}
		return treasury.borrowManagerPublic().getThreshold()
	}
`;
