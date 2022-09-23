const treasury = `
	let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
										.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
										?? panic("A DAOTreasuryV5 doesn't exist here.")
`;

export const GET_SIGNERS = `
	import DAOTreasuryV5 from 0xDAOTreasuryV5
	pub fun main(treasuryAddr: Address): {Address: Bool} {
		${treasury}
		return treasury.borrowManagerPublic().getSigners()
	}
`;

export const GET_THRESHOLD = `
	import DAOTreasuryV5 from 0xDAOTreasuryV5

	pub fun main(treasuryAddr: Address): UInt {
		${treasury}
		return treasury.borrowManagerPublic().getThreshold()
	}
`;
