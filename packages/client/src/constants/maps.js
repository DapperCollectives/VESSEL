import { ASSET_TYPES, COIN_TYPES, SAFE_TYPES } from "./enums";
export const ASSET_TYPE_TO_META = {
  [ASSET_TYPES.TOKEN]: {
    displayName: "Coins",
  },
  [ASSET_TYPES.NFT]: {
    displayName: "NFTs",
  },
};

export const COIN_TYPE_TO_META = {
  [COIN_TYPES.FLOW]: {
    contractName: "FlowToken",
    displayName: "FLOW",
    vaultName: "FlowToken.Vault",
    publicReceiverPath: { domain: "public", identifier: "flowTokenReceiver" },
  },
  [COIN_TYPES.FUSD]: {
    contractName: "FUSD",
    displayName: "FUSD",
    vaultName: "FUSD.Vault",
    publicReceiverPath: { domain: "public", identifier: "fusdReceiver" },
  },
  [COIN_TYPES.USDC]: {
    contractName: "FiatToken",
    displayName: "USDC",
    vaultName: "FiatToken.Vault",
    publicReceiverPath: { domain: "public", identifier: "USDCVaultReceiver" },
  },
  [COIN_TYPES.BLT]: {
    contractName: "BloctoToken",
    displayName: "BLT",
    vaultName: "BloctoToken.Vault",
    publicReceiverPath: { domain: "public", identifier: "bloctoTokenVault" },
  },
  [COIN_TYPES.STARLY]: {
    contractName: "StarlyToken",
    displayName: "STARLY",
    vaultName: "StarlyToken.Vault",
    publicReceiverPath: { domain: "public", identifier: "starlyTokenVault" },
  },
  [COIN_TYPES.REVV]: {
    contractName: "REVV",
    displayName: "REVV",
    vaultName: "REVV.Vault",
    publicReceiverPath: { domain: "public", identifier: "revvReceiver" },
  },
};

export const SAFE_TYPES_TO_META = {
  [SAFE_TYPES.SOCIAL]: {
    displayText: "Social",
  },
  [SAFE_TYPES.CREATOR]: {
    displayText: "Creator",
  },
  [SAFE_TYPES.PROTOCAL]: {
    displayText: "Protocol",
  },
  [SAFE_TYPES.COLLECTOR]: {
    displayText: "Collector",
  },
  [SAFE_TYPES.MEDIA]: {
    displayText: "Media",
  },
  [SAFE_TYPES.OTHER]: {
    displayText: "Other",
  },
};

/** 
 * TODO: Remove once API for fetching the name of the token is implemented
 * For now every time the fungible token is added to flow.json, the token name should be added here 
 * (in case it is different from the contract name) 
*/
export const CONTRACT_NAME_TO_COIN_TYPE = (contractName) => {
  switch (contractName) {
    case "FlowToken":
      return "FLOW";
    case "FUSD":
      return "FUSD";
    case "FiatToken":
      return "USDC";
    case "BloctoToken":
      return "BLT";
    case "StarlyToken":
      return "STARLY";
    case "REVV":
      return "REVV";
    default:
      return contractName;
  }
}
