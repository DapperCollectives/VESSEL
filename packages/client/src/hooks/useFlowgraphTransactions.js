import { useQuery } from "graphql-hooks";

const TRANSACTIONS_QUERY = `
  query AccountTransactions($address: ID!) {
    account(id: $address) {
      transactions (
        first: 5
        ordering: Descending
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            hash
            height
            index
            status
            time
            sequenceNumber
            eventCount
            proposer {
              address
            }
            payer {
              address
            }
            authorizers {
              address
            }
          }
        }
      }
    }
  }
`;

export default function useFlowgraphTransactions(address) {
  const { loading, error, data } = useQuery(TRANSACTIONS_QUERY, {
    variables: {
      address,
    },
  });

  if (loading || error || !data) {
    return [];
  }

  return data;
}
