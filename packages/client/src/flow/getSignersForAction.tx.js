export const GET_SIGNERS_FOR_ACTION = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2

	pub fun main(treasuryAddr: Address, actionUUID: UInt64): {Address: Bool} {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
											.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
											?? panic("A DAOTreasuryV2 doesn't exist here.")

		return treasury.borrowManagerPublic().getVerifiedSignersForAction(actionUUID: actionUUID)
	}
`;
