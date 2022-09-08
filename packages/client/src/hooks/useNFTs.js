import { useEffect, useReducer } from "react";
import { mutate, query, tx } from "@onflow/fcl";
import reducer, { INITIAL_STATE } from "../reducers/nfts";
import { REGULAR_LIMIT, SIGNED_LIMIT } from "constants/constants";
import { createSignature } from "../contexts/Web3";
import {
  CHECK_TREASURY_NFT_COLLECTION,
  PROPOSE_NFT_TRANSFER,
  SEND_NFT_TO_TREASURY,
  GET_TREASURY_IDENTIFIERS,
  GET_NFT_REF,
} from "../flow";

const storageKey = "vessel-assets";

const doSendNFTToTreasury = async (treasuryAddr, tokenId) => {
  return await mutate({
    cadence: SEND_NFT_TO_TREASURY,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(parseInt(tokenId), t.UInt64),
    ],
    limit: REGULAR_LIMIT,
  });
};

const doProposeNFTTransfer = async (contractName, contractAddress, treasuryAddr, recipient, nft) => {
  // Example: A.f8d6e0586b0a20c7.ZeedzINO.Collection-0
  // First part will contain the collection identifier, and the second will contain the tokenId
  const tokenInfo = nft.split("-");
  const intent = `Transfer ${tokenInfo[0]} NFT from the treasury to ${recipient}`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: PROPOSE_NFT_TRANSFER(contractName, contractAddress),
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(recipient, t.Address),
      arg(parseInt(tokenInfo[1]), t.UInt64),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

export default function useNFTs() {
  const [state, dispatch] = useReducer(reducer, [], (initial) => ({
    ...initial,
    ...INITIAL_STATE,
    NFTs: JSON.parse(localStorage.getItem(storageKey) || "{}"),
  }));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state.NFTs));
  }, [state.NFTs]);

  const checkCollection = async (treasuryAddr, identifier) => {
    let result = [];
    try {
      result = await query({
        cadence: CHECK_TREASURY_NFT_COLLECTION,
        args: (arg, t) => [
          arg(treasuryAddr, t.Address),
          arg(identifier, t.String),
        ],
      });
    } catch (e) {
      console.log("fcl error", e);
    }

    const tokens = result?.map((res) => ({
      tokenId: res.id,
      name: res.name,
      description: res.description,
      thumbnail: {
        url: res.imageURI,
      },
    }));

    dispatch({
      type: "SET_NFTS",
      payload: {
        [treasuryAddr]: {
          [identifier]: tokens,
        },
      },
    });
  };

  const getTreasuryCollections = async (treasuryAddr) => {
    const identifiers = await query({
      cadence: GET_TREASURY_IDENTIFIERS,
      args: (arg, t) => [arg(treasuryAddr, t.Address)],
    }).catch(console.error);

    const collections = (identifiers && identifiers[1]) ?? [];
    for (const identifier in collections) {
      await checkCollection(treasuryAddr, collections[identifier]);
    }
  };

  const getNFTReference = async (contractName, contractAddress, accountAddr, nftId) => {
    const nftRef = await query({
      cadence: GET_NFT_REF(contractName, contractAddress),
      args: (arg, t) => [
        arg(accountAddr, t.Address),
        arg(nftId, t.UInt64),
      ],
    }).catch(console.error);
    return nftRef;
  }

  const sendNFTToTreasury = async (treasuryAddr, tokenId) => {
    const res = await doSendNFTToTreasury(treasuryAddr, tokenId);
    await tx(res).onceSealed();
  };

  const proposeNFTTransfer = async (contractName, contractAddress, treasuryAddr, recipient, nft) => {
    const res = await doProposeNFTTransfer(contractName, contractAddress, treasuryAddr, recipient, nft);
    await tx(res).onceSealed();
    return res;
  };

  return {
    ...state,
    getTreasuryCollections,
    proposeNFTTransfer,
    sendNFTToTreasury,
    getNFTReference,
  };
}
