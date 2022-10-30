import React from 'react';

interface IProgressBarProps {
  progress: number;
}
const ProgressBar: React.FC<IProgressBarProps> = ({ progress = 70 }) => (
  <div className="is-flex is-justify-content-space-between column p-0 is-full">
    {new Array(100).fill(0).map((_, idx) => {
      const backgroundColor = idx <= progress ? '#26BD0E' : '#E5E5E5';
      return (
        <div key={idx} className="progress-bit" style={{ backgroundColor }} />
      );
    })}
  </div>
);

export default ProgressBar;
