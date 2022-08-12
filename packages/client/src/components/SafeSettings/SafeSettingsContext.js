// import { useState, createContext } from "react";
// export const SafeSettingsContext = createContext();
// export const SafeSettingsContextProvider = (props) => {
//   const { children, treasuryAddress } = props;
//   const INIT_STATE = {
//     name,
//     address,
//     currentStep: 0,
//     tokenAmount: 0,
//     recipient: "",
//     recipientValid: false,
//     assetType: initialState?.assetType || ASSET_TYPES.TOKEN,
//     coinType: COIN_TYPES.FLOW,
//     selectedNFT: initialState?.selectedNFT || "",
//     selectedNFTUrl: "",
//   };
//   const [sendModalState, setSendModalState] = useState(INIT_STATE);
//   return (
//     <SafeSettingsContext.Provider value={[sendModalState, setSendModalState]}>
//       {children}
//     </SafeSettingsContext.Provider>
//   );
// };
