import { useState, createContext } from "react";
export const SafeSettingsContext = createContext();
export const SafeSettingsContextProvider = (props) => {
  const { children, treasury } = props;
  const INIT_STATE = {
    newOwner: undefined,
    newThreshold: undefined,
  };
  const [safeSettingState, setSafeSettingState] = useState(INIT_STATE);
  return (
    <SafeSettingsContext.Provider
      value={{ safeSettingState, setSafeSettingState, treasury }}
    >
      {children}
    </SafeSettingsContext.Provider>
  );
};
