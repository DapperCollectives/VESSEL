import { Close } from "components/Svg";

const RemoveVault = ({ name, address, onCancel, onNext }) => {
    const nextButtonClasses = ["button flex-1 p-4", "is-link"];

    return (
        <>
            <div className="px-5 pt-5 columns is-vcentered is-multiline is-mobile">
                <h2 className="is-size-4 has-text-black column">Remove Token Vault</h2>
                <span className="pointer" onClick={onCancel}>
                    <Close className="mr-4" />
                </span>
            </div>
            <div className="border-light-top p-5 has-text-grey">
                <div className="flex-1 is-flex is-flex-direction-column">
                    <p>
                        This action will&nbsp;
                        <span className="has-text-weight-bold">
                            remove {name} ({address}) 
                        </span>
                        &nbsp;from the treasury. This is only possible if your balance for this token is 0.
                    </p>
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

export default RemoveVault;