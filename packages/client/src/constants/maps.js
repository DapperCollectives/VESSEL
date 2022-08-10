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
    contract: "0xFlowToken",
    displayName: "FLOW",
    vaultName: "FlowToken.Vault",
    publicReceiverPath: { domain: "public", identifier: "flowTokenReceiver" },
  },
  [COIN_TYPES.FUSD]: {
    contract: "0xFUSD",
    displayName: "FUSD",
    vaultName: "FUSD.Vault",
    publicReceiverPath: { domain: "public", identifier: "fusdReceiver" },
  },
  [COIN_TYPES.USDC]: {
    contract: "0xFiatToken",
    displayName: "USDC",
    vaultName: "FiatToken.Vault",
    publicReceiverPath: { domain: "public", identifier: "USDCVaultReceiver" },
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
