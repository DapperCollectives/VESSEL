import { REGULAR_LIMIT } from 'constants/constants';
import { COIN_TYPE_TO_META } from 'constants/maps';
import { mutate, query, tx } from '@onflow/fcl';
import {
  GET_ACCOUNT_BALANCE,
  SEND_TOKENS_TO_TREASURY,
  VAULT_EXIST_CHECK,
} from 'flow';

const COIN_TYPE_LIST = Object.keys(COIN_TYPE_TO_META);

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

  const getVaultExists = async (contractName, vaultPath, address) =>
    query({
      cadence: VAULT_EXIST_CHECK(contractName),
      args: (arg, t) => [arg(address, t.Address), arg(vaultPath, t.Path)],
    });

  const getBalanceByCoinType = async (contractName, vaultPath, address) =>
    query({
      cadence: GET_ACCOUNT_BALANCE(contractName),
      args: (arg, t) => [arg(address, t.Address), arg(vaultPath, t.Path)],
    });

  const getUserBalances = async (address) => {
    const result = COIN_TYPE_LIST.map((coinType) => ({
      coinType,
    }));
    for await (const coin of result) {
      const { coinType } = coin;
      try {
        const contractName = COIN_TYPE_TO_META[coinType].contractName;
        const vaultPath = COIN_TYPE_TO_META[coinType].publicBalancePath;
        const vaultExists = await getVaultExists(
          contractName,
          vaultPath,
          address
        );
        if (vaultExists) {
          const coinBalance = await getBalanceByCoinType(
            contractName,
            vaultPath,
            address
          );
          coin['balance'] = coinBalance;
        }
      } catch (error) {
        console.log(`error getting balance for ${coin.coinType}`, error);
      }
    }
    return result.filter((balance) => balance.balance);
  };

  const getUserVaults = async (address) => {
    const result = COIN_TYPE_LIST.map((coinType) => ({
      coinType,
    }));
    for await (const coin of result) {
      const { coinType } = coin;
      console.log(coinType);
      try {
        const { contractName } = COIN_TYPE_TO_META[coinType];
        const vaultPath = COIN_TYPE_TO_META[coinType].publicBalancePath;
        coin['exists'] = await getVaultExists(contractName, vaultPath, address);
      } catch (error) {
        console.log(`error getting vault for ${address}`, error);
      }
    }
    return result
      .filter((vault) => vault.exists)
      .map((vault) => vault.coinType);
  };

  return {
    getUserVaults,
    getUserBalances,
    doSendTokensToTreasury,
    initDepositTokensToTreasury,
  };
}
