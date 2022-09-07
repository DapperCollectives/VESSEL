export const GET_SIGNERS_FOR_ACTION = `
import DAOTreasuryV4 from 0xDAOTreasuryV4
import MyMultiSigV4 from 0xMyMultiSigV4

pub fun main(treasuryAddr: Address, actionUUID: UInt64): {Address: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  var responses = manager.getSignerResponsesForAction(actionUUID: actionUUID)

  let allSigners: {Address: String} = {}

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
`;
