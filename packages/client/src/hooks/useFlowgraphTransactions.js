import { useQuery } from "graphql-hooks";

const TRANSACTIONS_QUERY = `
  query AccountTransactions($address: ID!) {
    account(id: $address) {
      transactions (
        ordering: Descending
      ) {
        edges {
          node {
            hash
            status
            time
            sequenceNumber
            proposer {
              address
            }
            payer {
              address
            }
            authorizers {
              address
            }
            events {
              edges {
                node {
                  type {
                    id
                  }
                  fields
                }
              }
            }
            tokenTransfers {
              edges {
                node {
                  type
                  amount {
                    token {
                      id
                    }
                    value
                  }
                  counterparty {
                    address
                  }
                }
              }
            }
            nftTransfers {
              edges {
                node {
                  nft {
                    contract {
                      id
                    }
                    nftId
                  }
                  from {
                    address
                  }
                  to {
                    address
                  }
                }
              }
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

  return data.account.transactions.edges.map(({ node }) => ({
    ...node,
    events: node.events.edges.map(({ node }) => node),
    tokenTransfers: node.tokenTransfers.edges.map(({ node }) => node),
    nftTransfers: node.nftTransfers.edges.map(({ node }) => node),
  }));
}
