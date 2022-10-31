import React from 'react';

interface ISecurityStrengthLabelProps {
  progress: number;
  style?: React.CSSProperties;
}
const SecurityStrengthLabel: React.FC<ISecurityStrengthLabelProps> = ({
  progress = 70,
  style = {},
}) => (
  <div
    className="p-1 ml-2 px-2 rounded-sm has-text-white has-background-danger"
    style={style}
  >
    {progress > 50 ? 'WEAK' : 'STRONG'}
  </div>
);

export default SecurityStrengthLabel;
