import { useState, createContext } from "react";
import { ASSET_TYPES, COIN_TYPES } from "constants/enums";

export const SendTokensContext = createContext();
export const SendTokensContextProvider = (props) => {
  const { children, address, initialState } = props;
  const INIT_STATE = {
    address,
    currentStep: 0,
    tokenAmount: 0,
    recipient: "",
    recipientValid: false,
    assetType: initialState?.assetType ?? ASSET_TYPES.TOKEN,
    coinType: initialState?.coinType ?? COIN_TYPES.FLOW,
    selectedNFT: initialState?.selectedNFT ?? "",
    selectedNFTUrl: "",
  };
  const [sendModalState, setSendModalState] = useState(INIT_STATE);
  return (
    <SendTokensContext.Provider value={[sendModalState, setSendModalState]}>
      {children}
    </SendTokensContext.Provider>
  );
};
