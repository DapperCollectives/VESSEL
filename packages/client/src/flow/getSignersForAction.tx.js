export const GET_SIGNERS_FOR_ACTION = `
import DAOTreasuryV5 from 0xDAOTreasuryV5
import MyMultiSigV5 from 0xMyMultiSigV5

pub fun main(treasuryAddr: Address, actionUUID: UInt64): {Address: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV5 doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  var responses = manager.getSignerResponsesForAction(actionUUID: actionUUID)

  let allSigners: {Address: String} = {}

  for signer in responses.keys {
    switch MyMultiSigV5.SignerResponse(rawValue: responses[signer]!)!{
      case MyMultiSigV5.SignerResponse.approved:
        allSigners[signer] = "approved"
      case MyMultiSigV5.SignerResponse.rejected:
        allSigners[signer] = "rejected"
      case MyMultiSigV5.SignerResponse.pending:
        allSigners[signer] = "pending" 
      default:
        allSigners[signer] = "error"
    }
  }
  return allSigners
}
`;
