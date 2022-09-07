import { Close } from "components/Svg";

const RemoveCollection = ({ name, onCancel, onNext }) => {
    const nextButtonClasses = ["button flex-1 p-4", "is-link"];

    return (
        <>
            <div className="px-5 pt-5 columns is-vcentered is-multiline is-mobile">
                <h2 className="is-size-4 has-text-black column">Remove NFT Collection</h2>
                <span className="pointer" onClick={onCancel}>
                    <Close className="mr-4" />
                </span>
            </div>
            <div className="border-light-top p-5 has-text-grey">
                <div className="flex-1 is-flex is-flex-direction-column">
                    <p>Are you sure you want to remove {name} from your NFT collections list?</p>
                </div>
                <div className="is-flex is-align-items-center mt-5">
                    <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={nextButtonClasses.join(" ")} onClick={onNext}>
                        Confirm
                    </button>
                </div>
            </div>
        </>
    );
}

export default RemoveCollection;