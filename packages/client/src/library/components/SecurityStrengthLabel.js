import React from 'react';

const SecurityStrengthLabel = ({ progress = 70, style = {} }) => (
  <div
    className="p-1 ml-2 px-2 rounded-sm has-text-white has-background-danger"
    style={style}
  >
    {progress > 50 ? 'WEAK' : 'STRONG'}
  </div>
);

export default SecurityStrengthLabel;
