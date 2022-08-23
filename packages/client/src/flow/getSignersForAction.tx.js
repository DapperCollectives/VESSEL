export const GET_SIGNERS_FOR_ACTION = `
import DAOTreasuryV2 from 0xDAOTreasuryV2
import MyMultiSigV2 from 0xMyMultiSigV2

pub fun main(treasuryAddr: Address, actionUUID: UInt64): {Address: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  var responses = manager.getSignerResponsesForAction(actionUUID: actionUUID)

  let allSigners: {Address: String} = {}

  for signer in responses.keys {
    switch MyMultiSigV2.SignerResponse(rawValue: responses[signer]!)!{
      case MyMultiSigV2.SignerResponse.approved:
        allSigners[signer] = "approved"
      case MyMultiSigV2.SignerResponse.rejected:
        allSigners[signer] = "rejected"
      case MyMultiSigV2.SignerResponse.pending:
        allSigners[signer] = "pending" 
      default:
        allSigners[signer] = "error"
    }
  }
  return allSigners
}
`;
