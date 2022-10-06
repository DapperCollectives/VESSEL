import { createContext, useState } from 'react';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';

export const SendTokensContext = createContext();
export const SendTokensContextProvider = (props) => {
  const { children, address, initialState } = props;
  const INIT_STATE = {
    address,
    currentStep: 0,
    tokenAmount: 0,
    recipient: initialState?.recipient ?? '',
    recipientValid: initialState.recipientValid ?? false,
    assetType: initialState?.assetType ?? ASSET_TYPES.TOKEN,
    coinType: initialState?.coinType,
    selectedNFT: {},
    transactionType: initialState?.transactionType ?? TRANSACTION_TYPE.SEND,
  };
  const [sendModalState, setSendModalState] = useState(INIT_STATE);
  return (
    <SendTokensContext.Provider value={[sendModalState, setSendModalState]}>
      {children}
    </SendTokensContext.Provider>
  );
};
