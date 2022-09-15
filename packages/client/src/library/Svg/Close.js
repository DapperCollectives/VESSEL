const Close = ({ width = "24", height = "25", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 24 25"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M18.644 6.461l-.707-.707-6.54 6.54-6.188-6.187-.707.707 6.187 6.188-6.187 6.187.707.707 6.187-6.187 6.541 6.54.707-.707-6.54-6.54 6.54-6.541z"
      clipRule="evenodd"
    />
  </svg>
);
export default Close;
