import { useContext } from "react";
import { flatten } from "lodash";
import { SendTokensContext } from "../sendTokensContext";
import { ASSET_TYPES } from "constants/enums";
import { ASSET_TYPE_TO_META } from "constants/maps";
import CoinTypeDropDown from "./CoinTypeDropDown";
import NFTSelector from "./NFTSelector";

const AssetSelector = () => {
  const [sendModalState, setSendModalState, web3] =
    useContext(SendTokensContext);
  const { assetType, coinType, selectedNFT } = sendModalState;
  const userAddr = web3?.user?.addr;
  const userNFTs = web3?.NFTs?.[userAddr] ?? [];
  const nftsToDisplay = flatten(
    Object.entries(userNFTs).map(([collectionName, tokens]) =>
      tokens.map((t) => ({
        ...t,
        collectionName,
      }))
    )
  );
  return (
    <div className="mt-4">
      <div className="flex-1 is-flex is-flex-direction-column mb-4">
        <label className="has-text-grey mb-2">Asset</label>
        <div className="border-light rounded-sm p-1 is-flex column is-full">
          <button
            className={`button border-none flex-1 ${
              assetType === ASSET_TYPES.TOKEN &&
              "has-background-black has-text-white"
            }`}
            onClick={() =>
              setSendModalState((prevState) => ({
                ...prevState,
                assetType: ASSET_TYPES.TOKEN,
              }))
            }
          >
            {ASSET_TYPE_TO_META[ASSET_TYPES.TOKEN].displayName}
          </button>
          <button
            className={`button border-none flex-1 ${
              assetType === ASSET_TYPES.NFT &&
              "has-background-black has-text-white"
            }`}
            onClick={() =>
              setSendModalState((prevState) => ({
                ...prevState,
                assetType: ASSET_TYPES.NFT,
              }))
            }
          >
            {ASSET_TYPE_TO_META[ASSET_TYPES.NFT].displayName}
          </button>
        </div>
      </div>
      {assetType === ASSET_TYPES.TOKEN && (
        <CoinTypeDropDown
          coinType={coinType}
          setCoinType={(itemValue) => {
            setSendModalState((prevState) => ({
              ...prevState,
              coinType: itemValue,
            }));
          }}
        />
      )}
      {assetType === ASSET_TYPES.NFT && (
        <NFTSelector
          nftsToDisplay={nftsToDisplay}
          selectedNFT={selectedNFT}
          setSelectedNFT={(selected) => {
            setSendModalState((prevState) => ({
              ...prevState,
              selectedNFT: selected,
            }));
          }}
        />
      )}
    </div>
  );
};
export default AssetSelector;
