export const GET_TREASURY = `
	import DAOTreasuryV5 from 0xDAOTreasuryV5

	pub struct TreasuryInfo {
		pub var uuid: UInt64
		pub var signers: {Address: Bool}
		pub var threshold: UInt

		init(uuid: UInt64, signers: {Address: Bool}, threshold: UInt) {
			self.uuid = uuid
			self.signers = signers
			self.threshold = threshold
		}
	}

	pub fun main(treasuryAddr: Address): TreasuryInfo {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
											.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
											?? panic("A DAOTreasuryV5 doesn't exist here.")

		return TreasuryInfo(
			uuid: treasury.uuid,
			signers: treasury.borrowManagerPublic().getSigners(),
			threshold: treasury.borrowManagerPublic().getThreshold()
		)
	}
`;
