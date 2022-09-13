import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Web3Context } from "contexts/Web3";
import SafeDetailsSetting from "./components/SafeDetailsSetting";
import SignatureThreshold from "./components/SignatureThreshold";
import Owners from "./components/Owners";
import Assets from "./components/Assets";

const SafeSettings = () => {
  const location = useLocation();
  const treasuryAddress = location.pathname.split("/")[2];
  const web3 = useContext(Web3Context);
  const treasury = web3?.treasuries?.[treasuryAddress];
  const {
    setTreasury,
    proposeRemoveSigner,
    vaults,
    NFTs,
    addVault,
    addCollection,
    removeVault,
    removeCollection,
  } = web3;

  return (
    <React.Fragment>
      <SafeDetailsSetting treasury={treasury} setTreasury={setTreasury} />
      <SignatureThreshold treasury={treasury} />
      <Owners treasury={treasury} proposeRemoveSigner={proposeRemoveSigner} />
      <Assets
        treasury={treasury}
        vaults={vaults}
        NFTs={NFTs}
        addVault={addVault}
        addCollection={addCollection}
        removeVault={removeVault}
        removeCollection={removeCollection}
      />
    </React.Fragment>
  );
};
export default SafeSettings;
