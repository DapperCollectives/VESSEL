import { useEffect, useReducer } from "react";
import { mutate, query, tx } from "@onflow/fcl";
import reducer, { INITIAL_STATE } from "../reducers/nfts";
import { REGULAR_LIMIT, SIGNED_LIMIT } from "../contexts/Web3";
import { createSignature } from "../utils";
import {
  CHECK_TREASURY_NFT_COLLECTION,
  PROPOSE_NFT_TRANSFER,
  SEND_NFT_TO_TREASURY,
  SEND_COLLECTION_TO_TREASURY,
  GET_TREASURY_IDENTIFIERS,
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

const doSendCollectionToTreasury = async (treasuryAddr) => {
  return await mutate({
    cadence: SEND_COLLECTION_TO_TREASURY,
    args: (arg, t) => [arg(treasuryAddr, t.Address)],
    limit: REGULAR_LIMIT,
  });
};

const doProposeNFTTransfer = async (
  treasuryAddr,
  recipient,
  tokenId,
  message,
  keyIds,
  signatures,
  height
) => {
  return await mutate({
    cadence: PROPOSE_NFT_TRANSFER,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(recipient, t.Address),
      arg(parseInt(tokenId), t.UInt64),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64)
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

    const tokens = result?.map(res => ({
      tokenId: res.id,
      name: res.name,
      description: res.description,
      thumbnail: {
        url: res.thumbnail,
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

  const sendNFTToTreasury = async (treasuryAddr, tokenId) => {
    const res = await doSendNFTToTreasury(treasuryAddr, tokenId);
    await tx(res).onceSealed();
  };

  const sendCollectionToTreasury = async (treasuryAddr) => {
    const res = await doSendCollectionToTreasury(treasuryAddr);
    await tx(res).onceSealed();
    return res;
  };

  const proposeNFTTransfer = async (
    web3,
    treasuryAddr,
    recipient,
    selectedNFT
  ) => {
    const treasuryVault = `Capability<&AnyResource{A.${treasuryAddr.replace("0x", "")}.NonFungibleToken.CollectionPublic}>`;
    const intent = `Transfer a ${treasuryVault} NFT from the treasury to ${recipient}`;

    const { message, keyIds, signatures, height } = await createSignature(web3, intent);

    const tokenId = selectedNFT.split("-")[1];
    const res = await doProposeNFTTransfer(
      treasuryAddr,
      recipient,
      tokenId,
      message,
      keyIds,
      signatures,
      height
    );
    await tx(res).onceSealed();
    return res;
  };

  return {
    ...state,
    getTreasuryCollections,
    proposeNFTTransfer,
    sendNFTToTreasury,
    sendCollectionToTreasury,
  };
}
