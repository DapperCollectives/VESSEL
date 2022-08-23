export const GET_SIGNERS_FOR_ACTION = `
import DAOTreasuryV3 from 0xDAOTreasuryV3
import MyMultiSigV3 from 0xMyMultiSigV3

pub fun main(treasuryAddr: Address, actionUUID: UInt64): {Address: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV3 doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  var responses = manager.getSignerResponsesForAction(actionUUID: actionUUID)

  let allSigners: {Address: String} = {}

  for signer in responses.keys {
    switch MyMultiSigV3.SignerResponse(rawValue: responses[signer]!)!{
      case MyMultiSigV3.SignerResponse.approved:
        allSigners[signer] = "approved"
      case MyMultiSigV3.SignerResponse.rejected:
        allSigners[signer] = "rejected"
      case MyMultiSigV3.SignerResponse.pending:
        allSigners[signer] = "pending" 
      default:
        allSigners[signer] = "error"
    }
  }
  return allSigners
}
`;
