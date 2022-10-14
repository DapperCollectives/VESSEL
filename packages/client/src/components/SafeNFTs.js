import { useEffect } from 'react';
import { useModalContext } from '../contexts';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import { isEmpty } from 'lodash';
import TransferTokens from './TransferToken';

function SafeNFTs({ web3, address }) {
  const assetComponents = [];
  const { getTreasuryCollections } = web3;
  const userAddr = web3?.user?.addr;
  const modalContext = useModalContext();

  useEffect(() => {
    if (!userAddr) {
      return;
    }
    const getCollections = async () => {
      await getTreasuryCollections(address);
    };

    getCollections();
    // eslint-disable-next-line
  }, [userAddr]);

  const userNFTs = web3?.NFTs?.[address] ?? [];
  const nftsToDisplay = Object.entries(userNFTs)
    .map(([key, tokens]) => {
      if (isEmpty(tokens)) {
        return null;
      }
      return {
        key,
        collectionName: key.split('.')[2],
        tokens,
      };
    })
    .filter((x) => x);

  const showNFTModal = (collection, token) => {
    const { collectionName, key: collectionId } = collection;
    const { tokenId } = token;

    modalContext.openModal(
      <div className="p-5 has-text-black">
        <div>
          <img
            alt="token preview"
            src={token.thumbnail.url}
            className="is-block mx-auto"
          />
        </div>
        <div className="column is-flex is-full p-0 mt-4">
          <div className="flex-1">
            <p className="has-text-grey">Collection</p>
            <p className="mt-2">{collectionName}</p>
          </div>
          <div className="flex-1">
            <p className="has-text-grey">Number</p>
            <p className="mt-2">{tokenId}</p>
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button
            type="button"
            className="button is-border flex-1 mr-2"
            onClick={() => modalContext.closeModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button is-primary flex-1"
            onClick={() =>
              modalContext.openModal(
                <TransferTokens
                  sender={address}
                  initialState={{
                    assetType: ASSET_TYPES.NFT,
                    selectedNFT: { ...token, collectionName: collectionId },
                    transactionType: TRANSACTION_TYPE.SEND,
                  }}
                />
              )
            }
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  if (isEmpty(nftsToDisplay)) {
    assetComponents.push(
      <div
        className="is-flex is-justify-content-center is-flex-direction-column"
        key="nft-assets"
      >
        <div
          style={{
            height: 'calc(100vh - 350px)',
          }}
          className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
        >
          <h2 className="is-size-4">You don't have any NFTs added</h2>
        </div>
      </div>
    );
  } else {
    nftsToDisplay.forEach((collection) => {
      const { collectionName, tokens } = collection;
      assetComponents.push(
        <div
          className="is-flex is-justify-content-center is-flex-direction-column"
          key={collectionName}
        >
          <h2 className="is-size-4">{collectionName}</h2>
          <div className="is-flex mt-4">
            {tokens.map((token) => (
              <div
                className="p-4 border-light rounded-sm pointer"
                key={token.tokenId}
                onClick={() => showNFTModal(collection, token)}
              >
                <img alt="token media" src={token.thumbnail.url} />
                <p>{token.name}</p>
                <p>{token.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  }

  return <div className="column mt-5 p-0">{assetComponents}</div>;
}

export default SafeNFTs;
