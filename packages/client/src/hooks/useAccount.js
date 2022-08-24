import { mutate, query, tx } from "@onflow/fcl";
import {
  GET_USER_FLOW_BALANCE,
  GET_USER_FUSD_BALANCE,
  GET_USER_USDC_BALANCE,
  SEND_TOKENS_TO_TREASURY,
} from "flow";
import { COIN_TYPE_TO_META } from "constants/maps";
import { COIN_TYPES } from "constants/enums";
import { REGULAR_LIMIT } from "constants/constants";

const COIN_TYPE_LIST = [COIN_TYPES.FLOW, COIN_TYPES.FUSD, COIN_TYPES.USDC];

export default function useAccount() {
  const doSendTokensToTreasury = async (treasuryAddr, amount, coinType) => {
    const vaultPath = COIN_TYPE_TO_META[coinType].storageVaultPath;
    return await mutate({
      cadence: SEND_TOKENS_TO_TREASURY,
      args: (arg, t) => [
        arg(treasuryAddr, t.Address),
        arg(amount, t.UFix64),
        arg(vaultPath, t.Path),
      ],
      limit: REGULAR_LIMIT,
    });
  };

  //FOR TESTING UTILS ONLY, calling this method deposits tokens to treasury
  //should only be used for testing
  const initDepositTokensToTreasury = async (treasuryAddr) => {
    for await (const coinType of COIN_TYPE_LIST) {
      try {
        const res = await doSendTokensToTreasury(
          treasuryAddr,
          String(parseFloat(10).toFixed(8)),
          coinType
        );
        await tx(res).onceSealed();
      } catch (err) {
        console.log(`Failed to deposit ${coinType}, error: ${err}`);
      }
    }
  };

  const getBalanceByCoinType = async (coinType, address) => {
    let cadence;
    switch (coinType) {
      case COIN_TYPES.FLOW:
        cadence = GET_USER_FLOW_BALANCE;
        break;
      case COIN_TYPES.FUSD:
        cadence = GET_USER_FUSD_BALANCE;
        break;
      case COIN_TYPES.USDC:
        cadence = GET_USER_USDC_BALANCE;
      default:
        cadence = GET_USER_FLOW_BALANCE;
    }
    const balance = await query({
      cadence,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return balance;
  };

  const getUserBalances = async (address) => {
    const result = COIN_TYPE_LIST.map((coinType) => ({
      coinType,
      balance: 0,
    }));
    for await (const coin of result) {
      try {
        const coinBalance = await getBalanceByCoinType(coin.coinType, address);
        coin["balance"] = coinBalance;
      } catch (error) {
        console.log(`error getting balance for ${coin.coinType}`, error);
      }
    }
    return result;
  };
  return {
    getUserBalances,
    initDepositTokensToTreasury,
  };
}
