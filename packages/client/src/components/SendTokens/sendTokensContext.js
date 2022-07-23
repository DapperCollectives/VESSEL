import { useState, createContext } from "react";
export const SendTokensContext = createContext();
export const SendTokensContextProvider = (props) => {
  const { children, name, address, web3, initialState } = props;
  const [sendModalState, setSendModalState] = useState({
    name,
    address,
    currentStep: 0,
    amount: 0,
    receipient: "",
    assetType: initialState?.assetType || "FLOW",
    coinType: "FLOW",
    selectedNFT: initialState?.selectedNFT || "",
  });
  return (
    <SendTokensContext.Provider value={[sendModalState, setSendModalState]}>
      {children}
    </SendTokensContext.Provider>
  );
};
