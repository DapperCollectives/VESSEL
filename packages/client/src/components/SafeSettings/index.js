import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Web3Context } from "contexts/Web3";
import SafeDetailsSetting from "./components/SafeDetailsSetting";
import SignatureThreshold from "./components/SignatureThreshold";
import Owners from "./components/Owners";

const SafeSettings = () => {
  const location = useLocation();
  const treasuryAddress = location.pathname.split("/")[2];
  const web3 = useContext(Web3Context);
  const treasury = web3?.treasuries?.[treasuryAddress];
  return (
    <React.Fragment>
      <SafeDetailsSetting treasury={treasury} />
      <SignatureThreshold treasury={treasury} />
      {/* <Owners treasury={treasury} /> */}
    </React.Fragment>
  );
};
export default SafeSettings;
