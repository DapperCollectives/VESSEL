import { Web3Context } from "contexts/Web3";
import React, { useContext, useEffect, useState } from "react";

const SuccessModal = ({ data, type, onClose, safeName  }) => {
    const { getNFTReference } = useContext(Web3Context);

    const [imageURI, setImageURI] = useState();

    useEffect(() => {
        if (type === "NFT") {
            const getImageURL = async () => {
                const result = await getNFTReference(data.recipientAddr, data.nftID);
                setImageURI(result);
            };
            getImageURL().catch(console.error);
        }
    }, [type])

    function getNFTName(collectionId) {
        return collectionId.split(".")[2];
    }

    return (
        <div className="p-5 has-text-black has-text-left">
            <div className="pl-5 columns is-vcentered is-multiline is-mobile border-light-bottom">
                <h3 className="is-size-4 column is-half">{safeName}</h3>
            </div>
            <div className="p-4 mt-5">
                {type === "NFT" &&
                    <div>
                        <button>Sent</button>
                        <img src={imageURI} />
                        <span className="mr-2 mt-2 has-text-grey">
                            {getNFTName(data.collectionID)} #{data.nftID}
                        </span>
                        <span className="mr-2 mt-2 has-text-grey">
                            Sent to {data.recipientAddr}
                        </span>
                    </div>
                }
            </div>
            <div className="is-flex is-align-items-center mt-5">
                <button
                    className="button flex-1 p-4 mr-2 rounded-sm"
                    onClick={onClose}
                >
                    Done
                </button>
                <button
                    className="button flex-1 p-4 mr-2 rounded-sm"
                    onClick={onClose}
                >
                    View on Flowscan
                </button>
            </div>
        </div >
    );
}

export default SuccessModal;