import { COIN_TYPE_TO_META, CONTRACT_NAME_TO_COIN_TYPE } from "constants/maps";

export const checkResponse = async (response) => {
  if (!response.ok) {
    const { status, statusText, url } = response;
    const { error } = response.json ? await response.json() : {};
    throw new Error(
      JSON.stringify({ status, statusText: error || statusText, url })
    );
  }
  return response.json();
};

export const notifyError = (err, history, url) => {
  try {
    const response = JSON.parse(err.message);
    if (typeof response === "object") {
      history.replace(history.location.pathname, response);
    }
  } catch (error) {
    history.replace(history.location.pathname, {
      status: 500,
      statusText: `Server not available: ${err.message}`,
      url,
    });
  }
};

export const shortenAddr = (addr) => {
  if (!addr) return addr;
  const firstChunk = addr.slice(0, 4);
  const secondChunk = addr.slice(addr.length - 4, addr.length);
  return `${firstChunk}...${secondChunk}`;
};

// rudimentary address check before actually querying with bad inputs
export const isAddr = (addr) => {
  // remove special chars
  addr = addr.replace(/[^a-z0-9]/gi, "");
  // remove 0x prefix if exists
  const noPrefix = addr.startsWith("0x") ? addr.replace("0x", "") : addr;
  // result should be 16 chars long
  return noPrefix.length === 16;
};
export const formatAddress = (addr) => {
  return addr.startsWith("0x") ? addr : `0x${addr}`;
};

export const formatActionString = (str) => {
  const vaultRegex = /A\..*\.Vault/g;
  const collectionRegex = /A\..*\.Collection/g;
  const floatRegex = /[0-9]*[.][0-9]+/;
  const isTokenTransfer = vaultRegex.test(str);
  const isNFTTransfer = collectionRegex.test(str);
  let contractName;
  let result;
  if (isTokenTransfer) {
    contractName = str.match(vaultRegex)[0].split(".")[2];
    const tokenName = CONTRACT_NAME_TO_COIN_TYPE[contractName];
    result = str.replace(floatRegex, parseFloat(str.match(floatRegex)[0]));
    return result.replace(vaultRegex, tokenName);
  }
  if (isNFTTransfer) {
    contractName = str.match(collectionRegex)[0].split(".")[2];
    return str.replace(collectionRegex, contractName);
  }
  return str;
};

export const getProgressPercentageForSignersAmount = (signersAmount) => {
  return Math.min(60 + signersAmount * 10, 100);
};

export const getFlowscanUrlForTransaction = (hash) => {
  return `https://${
    process.env.REACT_APP_FLOW_ENV === "mainnet" ? "" : "testnet."
  }flowscan.org/transaction/${hash}`;
};

export const syncSafeOwnersWithSigners = (signers, safeOwners) => {
  const verifiedSigners = Object.keys(signers).filter((key) => signers[key]);

  const updatedOwners = verifiedSigners.map((address) => {
    const owner = safeOwners.find(
      (owner) => formatAddress(owner.address) === formatAddress(address)
    );
    return {
      name: owner?.name,
      address: address,
      verified: true,
    };
  });
  return updatedOwners;
};
export const getVaultId = (identifiers, coinType) => {
  const vaultIdentifiers = identifiers[0] ?? [];
  return vaultIdentifiers.find(
    (id) => id.indexOf(COIN_TYPE_TO_META[coinType].vaultName) >= 0
  );
};

export const removeAddressPrefix = (address) => address.replace("0x", "");

export const getTokenMeta = (vaultId) => {
  if (vaultId) {
    const tokenName = vaultId.split(".")[2],
      tokenType = CONTRACT_NAME_TO_COIN_TYPE[tokenName];
    return { ...COIN_TYPE_TO_META[tokenType], tokenType };
  }
};

export const getNFTMeta = (collectionId) => {
  const NFTName = collectionId?.split(".")[2];
  const NFTAddress = collectionId?.split(".")[1];
  return {
    NFTName,
    NFTAddress,
  };
};
