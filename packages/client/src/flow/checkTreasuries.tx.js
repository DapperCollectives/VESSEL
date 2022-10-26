export const GET_TREASURY = `
	import DAOTreasuryV5 from 0xDAOTreasuryV5

	pub struct SafeOwner {
		pub var address: Address
		pub var verified: Bool

		init(address: Address){
			self.address = address
			self.verified = true
		}
	}

	pub struct TreasuryInfo {
		pub var uuid: UInt64
		pub var safeOwners: [SafeOwner]
		pub var threshold: UInt


		init(uuid: UInt64, safeOwners: [SafeOwner], threshold: UInt) {
			self.uuid = uuid
			self.safeOwners = safeOwners
			self.threshold = threshold
		}
	}

	pub fun main(treasuryAddr: Address): TreasuryInfo {
		let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
											.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
											?? panic("A DAOTreasuryV5 doesn't exist here.")

		let signers = treasury.borrowManagerPublic().getSigners()
		let safeOwners: [SafeOwner] = []
		for addr in signers.keys {
			let owner = SafeOwner(address: addr)
			safeOwners.append(owner)
		}

		return TreasuryInfo(
			uuid: treasury.uuid,
			safeOwners: safeOwners,
			threshold: treasury.borrowManagerPublic().getThreshold()
		)
	}
`;
