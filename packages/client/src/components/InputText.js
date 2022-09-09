import React from "react";

const InputText = ({ value, onChange }) => (
  <div className="is-flex">
    <div className="flex-1">
      <input
        style={{ height: 48 }}
        className="border-light rounded-sm column is-full p-2 mt-2"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target)}
      />
    </div>
  </div>
);

export default InputText;