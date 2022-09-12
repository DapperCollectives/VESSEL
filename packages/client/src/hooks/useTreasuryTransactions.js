import { useEffect, useState } from "react";

const COMPANY_ID = process.env.REACT_APP_GRAFFLE_COMPANY_ID;
const PROJECT_ID = process.env.REACT_APP_GRAFFLE_PROJECT_ID;
const NETWORK = process.env.REACT_APP_FLOW_ENV === "testnet" ? "test" : "main";
const API_URL = `https://prod-${NETWORK}-net-dashboard-api.azurewebsites.net/api`;
const FETCH_URL = `${API_URL}/company/${COMPANY_ID}/search?projectId=${PROJECT_ID}`;

export default function useTreasuryTransactions(address) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      await fetch(FETCH_URL)
        .then((resp) => resp.json())
        .then((data) => {
          // temporary filter/map while events are updated to provide more data
          const newData = data
            .filter(
              (d) =>
                d.blockEventData.address === address ||
                d.blockEventData.executor === address
            )
            .map((d) => ({
              ...d,
              status: "confirmed",
              authorizers: Object.entries(d.blockEventData.signerResponses)
                .filter(([_, value]) => value === 0)
                .map(([key, _]) => ({ address: key })),
              tokenTransfers: [],
            }));
          setData(newData);
        });
    };
    fetchTransactions();
  }, [address]);

  return {
    data,
  };
}
