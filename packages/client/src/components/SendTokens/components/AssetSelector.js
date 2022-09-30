import { useContext } from "react";
import { flatten } from "lodash";
import { Web3Context } from "contexts/Web3";
import { ASSET_TYPES } from "constants/enums";
import { ASSET_TYPE_TO_META } from "constants/maps";
import { SendTokensContext } from "../sendTokensContext";
import CoinTypeDropDown from "./CoinTypeDropDown";
import NFTSelector from "./NFTSelector";

const AssetSelector = () => {
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const web3 = useContext(Web3Context);
  const { assetType, coinType, selectedNFT, address } = sendModalState;
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
    <div className="mt-5 px-5">
      <div className="mb-5">
        <div className="border-light rounded-sm p-0 is-flex">
          <button
            type="button"
            className={`button flex-1 has-text-weight-bold  ${
              assetType === ASSET_TYPES.TOKEN && "has-background-info"
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
            type="button"
            className={`button flex-1 has-text-weight-bold ${
              assetType === ASSET_TYPES.NFT && "has-background-info"
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
          address={address}
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
