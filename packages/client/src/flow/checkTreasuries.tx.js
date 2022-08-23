const treasury = `
	let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
										.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
										?? panic("A DAOTreasuryV3 doesn't exist here.")
`;

export const GET_SIGNERS = `
	import DAOTreasuryV3 from 0xDAOTreasuryV3
	pub fun main(treasuryAddr: Address): {Address: Bool} {
		${treasury}
		return treasury.borrowManagerPublic().getSigners()
	}
`;

export const GET_THRESHOLD = `
	import DAOTreasuryV3 from 0xDAOTreasuryV3

	pub fun main(treasuryAddr: Address): UInt {
		${treasury}
		return treasury.borrowManagerPublic().getThreshold()
	}
`;
