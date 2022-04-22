const treasury = `
	let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
										.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
										?? panic("A DAOTreasury doesn't exist here.")
`;

export const GET_SIGNERS = `
	import DAOTreasury from 0xDAOTreasury
	pub fun main(treasuryAddr: Address): {Address: Bool} {
		${treasury}
		return treasury.borrowManagerPublic().getSigners()
	}
`;

export const GET_THRESHOLD = `
	import DAOTreasury from 0xDAOTreasury

	pub fun main(treasuryAddr: Address): UInt64 {
		${treasury}
		return treasury.borrowManagerPublic().getThreshold()
	}
`;
