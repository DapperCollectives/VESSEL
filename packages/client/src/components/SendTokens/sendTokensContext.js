import { useState, createContext } from "react";
import { ASSET_TYPES, COIN_TYPES } from "constants/enums";
export const SendTokensContext = createContext();
export const SendTokensContextProvider = (props) => {
  const { children, name, address, web3, initialState } = props;
  const [sendModalState, setSendModalState] = useState({
    name,
    address,
    currentStep: 0,
    tokenAmount: 0,
    receipient: "",
    assetType: initialState?.assetType || ASSET_TYPES.TOKEN,
    coinType: COIN_TYPES.FLOW,
    selectedNFT: initialState?.selectedNFT || "",
  });
  return (
    <SendTokensContext.Provider
      value={[sendModalState, setSendModalState, web3]}
    >
      {children}
    </SendTokensContext.Provider>
  );
};
