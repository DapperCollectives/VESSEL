import React, { useContext, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Web3Context } from "contexts/Web3";
import SafeDetailsSetting from "./components/SafeDetailsSetting";
import SignatureThreshold from "./components/SignatureThreshold";
import Owners from "./components/Owners";
import { TokenAsset, NFTAsset } from "./components/Assets";

const SafeSettings = () => {
  const { hash: scrollTo, pathname } = useLocation();
  const treasuryAddress = pathname.split("/")[2];
  const web3 = useContext(Web3Context);
  const treasury = web3?.treasuries?.[treasuryAddress];
  const targetElementRef = useRef();
  const {
    address,
    setTreasury,
    proposeRemoveSigner,
    vaults,
    NFTs,
    getTreasuryVaults,
    getTreasuryCollections,
    addVault,
    addCollection,
    removeVault,
    removeCollection,
  } = web3;
  useEffect(() => {
    (() => {
      if (targetElementRef.current) {
        targetElementRef.current.scrollIntoView({ behavior: "smooth" });
      }
    })();
    //eslint-disable-next-line
  }, []);
  return (
    <React.Fragment>
      <SafeDetailsSetting treasury={treasury} setTreasury={setTreasury} />
      <SignatureThreshold treasury={treasury} />
      <Owners treasury={treasury} proposeRemoveSigner={proposeRemoveSigner} />
      <TokenAsset
        scrollToRef={scrollTo === "#tokenAsset" ? targetElementRef : null}
        userAddr={address}
        treasury={treasury}
        vaults={vaults}
        addVault={addVault}
        getTreasuryVaults={getTreasuryVaults}
        removeVault={removeVault}
      />
      <NFTAsset
        scrollToRef={scrollTo === "#nftAsset" ? targetElementRef : null}
        userAddr={address}
        treasury={treasury}
        NFTs={NFTs}
        addCollection={addCollection}
        getTreasuryCollections={getTreasuryCollections}
        removeCollection={removeCollection}
      />
    </React.Fragment>
  );
};
export default SafeSettings;
