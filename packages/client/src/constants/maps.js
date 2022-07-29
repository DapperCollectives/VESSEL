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
    displayName: "FLOW",
  },
  [COIN_TYPES.FUSD]: {
    displayName: "FUSD",
  },
  [COIN_TYPES.USDC]: {
    displayName: "USDC",
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
