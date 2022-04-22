import { useState, useEffect } from "react";
import { mutate, query, tx } from "@onflow/fcl";
import { shortenAddr } from "../utils";

import { INITIALIZE_TREASURY } from "../flow/initializeTreasury.tx";
import { GET_SIGNERS, GET_THRESHOLD } from "../flow/checkTreasuries.tx";

export default function useTreasury(addr) {
  const [loading, setLoading] = useState("Loading Treasuries...");
  const [treasuries, setTreasuries] = useState([]);
  const [creatingTreasury, setCreatingTreasury] = useState(false);
  const [createdTreasury, setCreatedTreasury] = useState(false);
  const [submittedTransaction, setSubmittedTransaction] = useState(false);

  useEffect(() => {
    if (!addr) return;
    const getSigners = async () => {
      const signers = await query({
        cadence: GET_SIGNERS,
        args: (arg, t) => [arg(addr, t.Address)],
      }).catch(console.error);

      if (signers) {
        const threshold = await query({
          cadence: GET_THRESHOLD,
          args: (arg, t) => [arg(addr, t.Address)],
        }).catch(console.error);

        setTreasuries([
          {
            name: `${shortenAddr(addr)}'s Safe`,
            signers: Object.keys(signers),
            threshold,
            addr,
          },
        ]);
      }
      setLoading("");
    };
    getSigners();
  }, [addr]);

  const initializeTreasury = async (initialSigners, initialThreshold) => {
    setCreatingTreasury(true);
    let res = await mutate({
      cadence: INITIALIZE_TREASURY,
      args: (arg, t) => [
        arg(initialSigners, t.Array(t.Address)),
        arg(initialThreshold, t.UInt64),
      ],
      limit: 55,
    });
    setSubmittedTransaction(true);
    await tx(res).onceSealed();
    setTreasuries([
      {
        name: `${shortenAddr(addr)}'s Safe`,
        signers: initialSigners,
        threshold: initialThreshold,
        addr,
      },
    ]);
    setCreatedTreasury(true);
    return res;
  };

  return {
    loading,
    creatingTreasury,
    createdTreasury,
    submittedTransaction,
    initializeTreasury,
    treasuries,
  };
}
