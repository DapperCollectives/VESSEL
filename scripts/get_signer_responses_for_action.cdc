import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV4 from "../contracts/MyMultiSig.cdc"

pub fun main(treasuryAddr: Address, actionUUID: UInt64): {Address: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  var responses = manager.getSignerResponsesForAction(actionUUID: actionUUID)

  let allSigners: {Address: String} = {}

  // Map enum values to strings
  for signer in responses.keys {
    switch MyMultiSigV4.SignerResponse(rawValue: responses[signer]!)!{
      case MyMultiSigV4.SignerResponse.approved:
        allSigners[signer] = "approved"
      case MyMultiSigV4.SignerResponse.rejected:
        allSigners[signer] = "rejected"
      case MyMultiSigV4.SignerResponse.pending:
        allSigners[signer] = "pending" 
      default:
        allSigners[signer] = "error"
    }
  }
  return allSigners
}