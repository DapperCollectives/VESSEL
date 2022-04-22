import React from "react";
import Dropdown from "./Dropdown";

const safeTypes = [
  "Social",
  "Creator",
  "Protocol",
  "Collector",
  "Media",
  "Other",
];

const SafeDetails = ({ safeType, setSafeType, safeName, setSafeName }) => (
  <>
    <div className="column mt-5 is-flex is-full">
      <h4 className="is-size-5">Safe Details</h4>
    </div>
    <div className="column is-flex is-full">
      <div className="flex-1 is-flex is-flex-direction-column pr-5">
        <label className="has-text-grey mb-2">
          Safe name<span className="has-text-red">*</span>
        </label>
        <input
          className="p-4 rounded-sm"
          type="text"
          placeholder="Choose a local name for your safe"
          value={safeName}
          onChange={(e) => setSafeName(e.target.value)}
        />
      </div>
      <div className="flex-1 is-flex is-flex-direction-column">
        <label className="has-text-grey mb-2">
          Safe type<span className="has-text-red-500">*</span>
        </label>
        <Dropdown value={safeType} values={safeTypes} setValue={setSafeType} />
      </div>
    </div>
  </>
);

export default SafeDetails;
