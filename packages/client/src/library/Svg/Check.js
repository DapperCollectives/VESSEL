const Check = ({ width = "24", height = "24", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 24 24"
  >
    <rect width="24" height="24" fill="#22AA0D" rx="12" />
    <path stroke="#fff" d="M5 13l5 4 8-9" />
  </svg>
);
export default Check;
