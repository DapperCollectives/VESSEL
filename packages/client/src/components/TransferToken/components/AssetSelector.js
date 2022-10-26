import { useContext } from 'react';
import { TransferTokensContext } from '../../../contexts/TransferTokens';
import { Web3Context } from 'contexts/Web3';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import { ASSET_TYPE_TO_META } from 'constants/maps';
import { flatten } from 'lodash';
import CoinTypeDropDown from './CoinTypeDropDown';
import NFTSelector from './NFTSelector';

const AssetSelector = () => {
  const web3 = useContext(Web3Context);

  const [sendModalState, setSendModalState] = useContext(TransferTokensContext);
  const {
    assetType,
    coinType,
    coinBalances,
    selectedNFT,
    sender,
    transactionType,
  } = sendModalState;
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
              assetType === ASSET_TYPES.TOKEN && 'has-background-info'
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
              assetType === ASSET_TYPES.NFT && 'has-background-info'
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
      {assetType === ASSET_TYPES.TOKEN && coinBalances && (
        <CoinTypeDropDown
          address={sender}
          coinType={coinType}
          setCoinType={(itemValue) => {
            setSendModalState((prevState) => ({
              ...prevState,
              coinType: itemValue,
            }));
          }}
          tooltipText={
            transactionType === TRANSACTION_TYPE.DEPOSIT
              ? 'Only tokens supported by Vessel can be transferred to this treasury.'
              : undefined
          }
          balances={coinBalances}
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
