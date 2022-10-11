const ArrowDown = ({ width = '12', height = '12', className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 12 12"
  >
    <path stroke="currentColor" d="M1 11h10V1M11 11L1 1" />
  </svg>
);
export default ArrowDown;
