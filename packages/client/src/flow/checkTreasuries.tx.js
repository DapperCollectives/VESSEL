const treasury = `
	let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
										.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
										?? panic("A DAOTreasuryV2 doesn't exist here.")
`;

export const GET_SIGNERS = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	pub fun main(treasuryAddr: Address): {Address: Bool} {
		${treasury}
		return treasury.borrowManagerPublic().getSigners()
	}
`;

export const GET_THRESHOLD = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2

	pub fun main(treasuryAddr: Address): UInt64 {
		${treasury}
		return treasury.borrowManagerPublic().getThreshold()
	}
`;
