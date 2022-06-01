export const EXECUTE_ACTION = `
	import DAOTreasury from 0xDAOTreasury

	transaction(treasuryAddr: Address, actionUUID: UInt64) {
		
		prepare(signer: AuthAccount) {
			let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")
										
			treasury.executeAction(actionUUID: actionUUID)
		}
		execute {

		}
	}
`;
