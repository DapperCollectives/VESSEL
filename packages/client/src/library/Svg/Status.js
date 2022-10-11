const Status = ({ width = '12', height = '12', className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 12 12"
  >
    <rect width={width} height={height} rx="6" fill="currentColor" />
  </svg>
);

export default Status;
