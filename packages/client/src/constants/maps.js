import { ASSET_TYPES, COIN_TYPES, SAFE_TYPES } from "./enums";
import { PROPOSE_TRANSFER_FLOW, PROPOSE_TRANSFER_FUSD } from "flow";
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
    actions: {
      proposeTransfer: PROPOSE_TRANSFER_FLOW,
    },
  },
  [COIN_TYPES.FUSD]: {
    displayName: "FUSD",
    actions: {
      proposeTransfer: PROPOSE_TRANSFER_FUSD,
    },
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
