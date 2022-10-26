import { useState } from 'react';

const EditSafeName = ({ name, onCancel, onSubmit }) => {
  const [currSafeName, setCurrSafeName] = useState(name ?? '');

  const isNameValid = currSafeName.trim().length > 0;

  const onSubmitClick = () => {
    onSubmit(currSafeName);
  };

  const submitButtonClasses = [
    'button flex-1 is-primary',
    isNameValid ? '' : 'disabled',
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
            <button className="button flex-1 is-border mr-2" onClick={onCancel}>
              Cancel
            </button>
            <button
              className={submitButtonClasses.join(' ')}
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

export default EditSafeName;
