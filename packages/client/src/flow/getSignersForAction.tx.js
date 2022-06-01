export const GET_SIGNERS_FOR_ACTION = `
	import DAOTreasury from 0xDAOTreasury

	pub fun main(treasuryAddr: Address, actionUUID: UInt64): {Address: Bool} {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")

		return treasury.borrowManagerPublic().getVerifiedSignersForAction(actionUUID: actionUUID)
	}
`;
