export const GET_TREASURY_IDENTIFIERS = `
	import DAOTreasuryV4 from 0xDAOTreasuryV4

	pub fun main(treasuryAddr: Address): [[String]] {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
											.borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
											?? panic("A DAOTreasuryV4 doesn't exist here.")

		let answer: [[String]] = []
		answer.append(treasury.getVaultIdentifiers())
		answer.append(treasury.getCollectionIdentifiers())
		return answer
	}
`;
