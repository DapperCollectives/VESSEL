import React, { useMemo, useState } from "react";
import { useModalContext } from "../contexts";
import { useClipboard, useAddressValidation } from "../hooks";
import { useHistory } from "react-router-dom";
import Dropdown from "components/Dropdown";
import ProgressBar from "./ProgressBar";
import { Person, Minus, Plus, Check } from "./Svg";
import { COIN_TYPE_TO_META } from "constants/maps";
import {
  getProgressPercentageForSignersAmount,
  isAddr,
  formatAddress,
} from "../utils";

const SignatureBar = ({ threshold, safeOwners }) => (
  <div className="is-flex column p-0 is-full">
    {new Array(safeOwners?.length).fill().map((_, idx) => {
      const backgroundColor = idx + 1 <= threshold ? "black" : "#E5E5E5";
      return (
        <div
          key={idx}
          className="progress-bit mr-1"
          style={{ backgroundColor, width: 4 }}
        />
      );
    })}
  </div>
);

const EditSafeName = ({ name, onCancel, onSubmit }) => {
  const [currSafeName, setCurrSafeName] = useState(name);
  const isNameValid = useMemo(
    () => currSafeName.trim().length > 0,
    [currSafeName]
  );

  const onSubmitClick = () => {
    onSubmit(currSafeName);
  };

  const submitButtonClasses = [
    "button flex-1 p-4",
    isNameValid ? "is-link" : "is-light is-disabled",
  ];

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Edit safe name</h2>
        <p className="has-text-grey">Update the local name of your safe</p>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="mb-2">Name</label>
          <input
            className="p-4 rounded-sm border-light"
            type="text"
            placeholder="Choose a local name for your safe"
            value={currSafeName}
            onChange={(e) => setCurrSafeName(e.target.value)}
          />
          <div className="is-flex is-align-items-center mt-6">
            <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
              Cancel
            </button>
            <button
              className={submitButtonClasses.join(" ")}
              disabled={!isNameValid}
              onClick={onSubmitClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const EditSignatureThreshold = ({
  safeOwners,
  threshold,
  newOwner,
  onCancel,
  onReview,
}) => {
  const [currSignersAmount, setCurrSignersAmount] = useState(threshold);
  const allSafeOwners = useMemo(() => {
    const owners = [...safeOwners];

    if (newOwner) {
      owners.push(newOwner);
    }

    return owners;
  }, [safeOwners, newOwner]);

  const onMinusSignerClick = () => {
    setCurrSignersAmount((curr) => Math.max(curr - 1, 1));
  };

  const onPlusSignerClick = () => {
    setCurrSignersAmount((curr) => Math.min(curr + 1, allSafeOwners.length));
  };

  const onReviewClick = () => {
    onReview(newOwner, currSignersAmount);
  };

  const canContinueToReview = !!newOwner || currSignersAmount !== threshold;
  const signerClasses = [
    "is-flex",
    "is-justify-content-center",
    "is-align-items-center",
  ];
  const minusSignerClasses = [
    ...signerClasses,
    "border-light-right",
    currSignersAmount > 1 ? "pointer has-text-black" : "is-disabled",
  ];
  const plusSignerClasses = [
    ...signerClasses,
    currSignersAmount < allSafeOwners.length
      ? "pointer has-text-black"
      : "is-disabled",
  ];
  const reviewButtonClasses = [
    "button flex-1 p-4",
    canContinueToReview ? "is-link" : "is-light is-disabled",
  ];
  const progress = getProgressPercentageForSignersAmount(currSignersAmount);

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Set a new threshold</h2>
        <p className="has-text-grey">
          Signatures needed to approve a new transaction
        </p>
      </div>
      <div className="border-light-top py-6 px-5 has-text-grey">
        <p className="mb-2">Signatures required to confirm a transaction</p>
        <div className="is-flex border-light rounded-sm">
          <div className="px-5 border-light-right has-text-black">
            <Person />
          </div>
          <div className="flex-1 is-flex is-align-items-center px-5 border-light-right has-text-black">
            {currSignersAmount} of {Math.max(allSafeOwners.length, 1)} owner(s)
          </div>
          <div
            className={minusSignerClasses.join(" ")}
            style={{ width: 48 }}
            onClick={onMinusSignerClick}
          >
            <Minus />
          </div>
          <div
            className={plusSignerClasses.join(" ")}
            style={{ width: 48 }}
            onClick={onPlusSignerClick}
          >
            <Plus />
          </div>
        </div>
        <div className="flex-1 is-flex is-flex-direction-column mt-5">
          <div className="is-flex is-justify-content-space-between mb-2">
            <label className="has-text-black">Security Strength</label>
            <label className="has-text-black">{progress}%</label>
          </div>
          <div className="is-flex flex-1">
            <div
              className="is-flex column is-full border-light rounded-sm"
              style={{ minHeight: 48 }}
            >
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={reviewButtonClasses.join(" ")}
            disabled={!canContinueToReview}
            onClick={onReviewClick}
          >
            Review
          </button>
        </div>
      </div>
    </>
  );
};

const RemoveSafeOwner = ({ web3, safeOwner, onCancel, onSubmit }) => {
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [address, setAddress] = useState(safeOwner.address);
  const [addressValid, setAddressValid] = useState(true);
  const isFormValid = addressValid;

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    setAddressValid(isAddr(newAddress) && (await isAddressValid(newAddress)));
  };

  const onSubmitClick = () => {
    onSubmit({ name: safeOwner.name, address });
  };

  const submitButtonClasses = [
    "button flex-1 p-4",
    isFormValid ? "is-link" : "is-light is-disabled",
  ];

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Remove safe owner</h2>
        <p className="has-text-grey">
          This user will no longer be able to sign transactions
        </p>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column mt-4">
          <label className="has-text-grey mb-2">
            Address<span className="has-text-red">*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="p-4 rounded-sm column is-full border-light"
              type="text"
              placeholder="Enter user's FLOW address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
            />
            {addressValid && (
              <div style={{ position: "absolute", right: 17, top: 14 }}>
                <Check />
              </div>
            )}
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            disabled={!isFormValid}
            className={submitButtonClasses.join(" ")}
            onClick={onSubmitClick}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
};

const AddSafeOwner = ({ web3, onCancel, onNext, safeOwners }) => {
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const isFormValid = name?.trim().length > 0 && addressValid;

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    setAddressValid(
      isAddr(newAddress) &&
      (await isAddressValid(newAddress)) &&
      !isAddressExisting(safeOwners, newAddress)
    );
  };

  const isAddressExisting = (safeOwners, newAddress) => {
    const address = formatAddress(newAddress);
    return (
      safeOwners.filter((obj) => obj.address === address && obj.verified)
        .length !== 0
    );
  };

  const onNextClick = () => {
    onNext({
      name,
      address,
    });
  };

  const nextButtonClasses = [
    "button flex-1 p-4",
    isFormValid ? "is-link" : "is-light is-disabled",
  ];

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Add a new safe owner</h2>
        <p className="has-text-grey">
          Heads up, they'll have full access to this safe
        </p>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">
            Owner Name<span className="has-text-red">*</span>
          </label>
          <input
            className="p-4 rounded-sm border-light"
            type="text"
            placeholder="Enter local owner name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex-1 is-flex is-flex-direction-column mt-4">
          <label className="has-text-grey mb-2">
            Address<span className="has-text-red">*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="p-4 rounded-sm column is-full border-light"
              type="text"
              placeholder="Enter user's FLOW address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
            />
            {addressValid && (
              <div style={{ position: "absolute", right: 17, top: 14 }}>
                <Check />
              </div>
            )}
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            disabled={!isFormValid}
            className={nextButtonClasses.join(" ")}
            onClick={onNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

const AddVault = ({ onCancel, onNext }) => {
  const onNextClick = () => {
    onNext({
      coinType,
    });
  };

  const nextButtonClasses = [
    "button flex-1 p-4",
    "is-link"
  ];

  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));

  const [coinType, setCoinType] = useState(coinTypes[0].displayText);

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Add Vault</h2>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">
            Contract Name
          </label>
          <Dropdown
            value={coinType}
            values={coinTypes}
            setValue={setCoinType}
            style={{ height: "45px" }}
          />
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={nextButtonClasses.join(" ")}
            onClick={onNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

const AddCollection = ({ web3, onCancel, onNext }) => {
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [contractName, setContractName] = useState("");
  const [address, setAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const isFormValid = contractName?.trim().length > 0 && addressValid;

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    setAddressValid(isAddr(newAddress) && (await isAddressValid(newAddress)));
  };

  const onNextClick = () => {
    onNext({
      contractName,
      address,
    });
  };

  const nextButtonClasses = [
    "button flex-1 p-4",
    isFormValid ? "is-link" : "is-light is-disabled",
  ];

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Add Collection</h2>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">
            Contract Name
          </label>
          <input
            className="p-4 rounded-sm border-light"
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
          />
          <div className="flex-1 is-flex is-flex-direction-column mt-4">
            <label className="has-text-grey mb-2">
              Contract Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="p-4 rounded-sm column is-full border-light"
                type="text"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
              />
              {addressValid && (
                <div style={{ position: "absolute", right: 17, top: 14 }}>
                  <Check />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            disabled={!isFormValid}
            className={nextButtonClasses.join(" ")}
            onClick={onNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

const ReviewSafeEdits = ({
  safeOwners,
  threshold,
  newOwner,
  newThreshold,
  onBack,
  onSubmit,
}) => {
  const thresholdForDisplay = useMemo(
    () => newThreshold ?? threshold,
    [newThreshold, threshold]
  );
  const safeOwnersForDisplay = useMemo(() => {
    const owners = [...safeOwners];

    if (newOwner) {
      owners.push(newOwner);
    }

    return owners;
  }, [safeOwners, newOwner]);

  const onSubmitClick = () => {
    onSubmit(newOwner, newThreshold);
  };

  const renderRow = (label, value) => {
    return (
      <div className="is-flex is-align-items-center is-justify-content-space-between py-5 border-light-top">
        <label className="has-text-grey">{label}</label>
        <div className="has-text-black">{value}</div>
      </div>
    );
  };

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Review updates</h2>
        <p className="has-text-grey">
          Confirm the details below before submitting
        </p>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="is-flex pt-1 pb-5">
          <div className="is-flex flex-1 is-flex-direction-column border-light-right">
            <label>Number of owners</label>
            <div className="has-text-black is-size-5">
              {safeOwnersForDisplay.length}
            </div>
          </div>
          <div className="is-flex flex-1 is-flex-direction-column pl-5">
            <label>Signature threshold</label>
            <div className="is-flex is-align-items-center">
              <span
                className="is-size-5 has-text-black"
                style={{ whiteSpace: "nowrap" }}
              >
                {thresholdForDisplay} of {safeOwnersForDisplay.length}
              </span>
              <div className="is-flex ml-1" style={{ height: 16 }}>
                <SignatureBar
                  threshold={thresholdForDisplay}
                  safeOwners={safeOwnersForDisplay}
                />
              </div>
            </div>
          </div>
        </div>
        {newOwner && renderRow("New owner", newOwner.name)}
        {newOwner && renderRow("Address", newOwner.address)}
        {renderRow("Transaction date", new Date().toLocaleDateString("en-US"))}
        <div className="is-flex is-align-items-center mt-5">
          <button className="button flex-1 p-4 mr-2" onClick={onBack}>
            Back
          </button>
          <button className="button flex-1 p-4 is-link" onClick={onSubmitClick}>
            Submit
          </button>
        </div>
        <p className="mt-4">
          You're about to create a transaction and will have to confirm it with
          your currently connected wallet.
        </p>
      </div>
    </>
  );
};

function SafeSettings({ address, web3, name, threshold, safeOwners }) {
  const modalContext = useModalContext();
  const safeAddressClipboard = useClipboard();
  const ownersAddressClipboard = useClipboard();
  const history = useHistory();
  const {
    setTreasury,
    proposeAddSigner,
    updateThreshold,
    proposeRemoveSigner,
    proposeAddVault,
    proposeAddCollection
  } = web3;
  const verifiedSafeOwners = safeOwners.filter((so) => so.verified);
  const onEditNameSubmit = (newName) => {
    modalContext.closeModal();
    setTreasury(address, { name: newName });
  };

  const onReviewSafeEditsSubmit = async (newOwner, newThreshold) => {
    const thresholdToPersist = newThreshold ?? threshold;

    if (newOwner) {
      await proposeAddSigner(formatAddress(newOwner.address));
    }

    if (thresholdToPersist !== threshold) {
      await updateThreshold(thresholdToPersist);
    }
    setTreasury(address, {
      threshold: thresholdToPersist,
      safeOwners: [...safeOwners, { ...newOwner, verified: false }],
    });

    modalContext.closeModal();
    history.push(`/safe/${address}`);
  };

  const onRemoveSafeOwnerSubmit = async (ownerToBeRemoved) => {
    if (ownerToBeRemoved) {
      await proposeRemoveSigner(formatAddress(ownerToBeRemoved.address));
    }

    modalContext.closeModal();
    history.push(`/safe/${address}`);
  };

  const onAddVaultSubmit = async (form) => {
    await proposeAddVault(form.coinType);

    modalContext.closeModal();
    history.push(`/safe/${address}`);
  };

  const onAddCollectionSubmit = async (form) => {
    await proposeAddCollection(form.contractName, formatAddress(form.address));

    modalContext.closeModal();
    history.push(`/safe/${address}`);
  };

  const openReviewEditsModal = (newOwner, newThreshold, onBack) => {
    modalContext.closeModal();
    modalContext.openModal(
      <ReviewSafeEdits
        safeOwners={verifiedSafeOwners}
        threshold={threshold}
        newOwner={newOwner}
        newThreshold={newThreshold}
        onBack={onBack}
        onSubmit={onReviewSafeEditsSubmit}
      />
    );
  };

  const openEditNameModal = () => {
    modalContext.openModal(
      <EditSafeName
        name={name}
        onCancel={() => modalContext.closeModal()}
        onSubmit={onEditNameSubmit}
      />
    );
  };

  const openEditSignatureThresholdModal = (newOwner) => {
    modalContext.openModal(
      <EditSignatureThreshold
        safeOwners={verifiedSafeOwners}
        threshold={threshold}
        newOwner={newOwner}
        onCancel={() => modalContext.closeModal()}
        onReview={(newOwner, newThreshold) =>
          openReviewEditsModal(newOwner, newThreshold, () =>
            openEditSignatureThresholdModal(newOwner)
          )
        }
      />
    );
  };

  const openRemoveOwnerModal = (safeOwner) => {
    modalContext.openModal(
      <RemoveSafeOwner
        web3={web3}
        safeOwner={safeOwner}
        onCancel={() => modalContext.closeModal()}
        onSubmit={onRemoveSafeOwnerSubmit}
      />
    );
  };

  const openAddOwnerModal = () => {
    modalContext.openModal(
      <AddSafeOwner
        web3={web3}
        onCancel={() => modalContext.closeModal()}
        onNext={openEditSignatureThresholdModal}
        safeOwners={safeOwners}
      />
    );
  };

  const openAddVaultModal = () => {
    modalContext.openModal(
      <AddVault
        onCancel={() => modalContext.closeModal()}
        onNext={onAddVaultSubmit}
      />
    );
  };

  const openAddCollectionModal = () => {
    modalContext.openModal(
      <AddCollection
        web3={web3}
        onCancel={() => modalContext.closeModal()}
        onNext={onAddCollectionSubmit}
      />
    );
  };

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Safe Details</h4>
      </div>
      <div className="column p-5 mt-4 mb-5 is-flex is-full rounded-sm border-light has-shadow">
        <div className="border-light-right pr-5 mr-5 flex-1">
          <div className="has-text-grey">Name</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>{name}</div>
            <div className="is-underlined pointer" onClick={openEditNameModal}>
              Edit
            </div>
          </div>
        </div>
        <div className="border-light-right pr-5 mr-5 flex-1">
          <div className="has-text-grey">Address</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>{address}</div>
            <div
              className="is-underlined pointer"
              onClick={() => safeAddressClipboard.copy(address)}
            >
              {safeAddressClipboard.textJustCopied === address
                ? "Copied"
                : "Copy"}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="has-text-grey">Contract Version</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>Flow 1.2</div>
            <div className="is-underlined">Details</div>
          </div>
        </div>
      </div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Signature Threshold</h4>
      </div>
      <div className="column p-5 mt-4 mb-5 is-flex is-full rounded-sm border-light has-shadow">
        <div className="mr-5 is-flex">
          <SignatureBar threshold={threshold} safeOwners={verifiedSafeOwners} />
        </div>
        <div className="flex-1">
          {threshold} out of {verifiedSafeOwners?.length} signatures are
          required to confirm a new transaction
        </div>
        <div>
          <span
            className="is-underlined pointer"
            onClick={() => openEditSignatureThresholdModal()}
          >
            Edit
          </span>
        </div>
      </div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Owners</h4>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        {Array.isArray(verifiedSafeOwners) &&
          verifiedSafeOwners.map((so, idx) => (
            <div
              className="is-flex column is-full p-5 border-light-bottom"
              key={idx}
            >
              <div className="px-2 mr-6" style={{ minWidth: 120 }}>
                {so.name ?? `Signer #${idx + 1}`}
              </div>
              <div className="flex-1">{so.address}</div>
              <div>
                <span
                  className="is-underlined mr-5 pointer"
                  onClick={() => ownersAddressClipboard.copy(so.address)}
                >
                  {ownersAddressClipboard.textJustCopied === so.address
                    ? "Copied"
                    : "Copy Address"}
                </span>
                <span
                  className="is-underlined pointer"
                  onClick={() => openRemoveOwnerModal(so)}
                >
                  Remove
                </span>
              </div>
            </div>
          ))}
      </div>
      <button
        className="button mt-4 is-full p-4 border-light"
        onClick={openAddOwnerModal}
      >
        Add new owner
      </button>
      <div className="p-0 mt-5">
        <h4 className="is-size-5">Assets</h4>
        <button
          className="button mt-4 is-full p-4 border-light is-align-self-flex-end"
          onClick={openAddVaultModal}
        >
          Add Vault
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
        <button
          className="button mt-4 is-full p-4 border-light is-align-self-flex-end"
          onClick={openAddCollectionModal}
        >
          Add Collection
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
      </div>
    </>
  );
}

export default SafeSettings;
