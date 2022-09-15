const Trash = ({ width = "20", height = "17", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 20 17"
  >
    <path stroke="currentColor" d="M3 1h14M0 4h20M3 4l2.625 12h8.75L17 4" />
  </svg>
);
export default Trash;
