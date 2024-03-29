import React from 'react';
import { Dropdown } from 'library/components';
import { SAFE_TYPES_TO_META } from 'constants/maps';

const safeTypes = Object.entries(SAFE_TYPES_TO_META).map((type) => ({
  itemValue: type[0],
  displayText: type[1].displayText,
}));

const SafeDetails = ({ safeType, setSafeType, safeName, setSafeName }) => (
  <>
    <div className="column mt-5 is-flex is-full">
      <h2>Safe Details</h2>
    </div>
    <div className="column is-flex is-full">
      <div className="flex-1 is-flex is-flex-direction-column pr-5">
        <p className="has-text-grey mb-2">
          Safe name
          <span className="has-text-red">*</span>
        </p>
        <input
          className="p-4 rounded-sm border-light"
          type="text"
          placeholder="Choose a local name for your safe"
          value={safeName}
          onChange={(e) => setSafeName(e.target.value)}
        />
      </div>
      <div className="flex-1 is-flex is-flex-direction-column">
        <p className="has-text-grey mb-2">
          Safe type
          <span className="has-text-red">*</span>
        </p>
        <Dropdown
          selectedValue={safeType}
          options={safeTypes}
          setOption={setSafeType}
          renderOption={(_, displayText) => (
            <span className="has-text-black">{displayText}</span>
          )}
        />
      </div>
    </div>
  </>
);

export default SafeDetails;
