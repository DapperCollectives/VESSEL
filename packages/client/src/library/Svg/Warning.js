const Warning = ({ width = "24", height = "25", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 24 25"
  >
    <path
      d="M21.5264 19L12.8661 4C12.4812 3.33333 11.519 3.33333 11.1341 4L2.47385 19C2.08895 19.6667 2.57007 20.5 3.33987 20.5H20.6604C21.4302 20.5 21.9113 19.6667 21.5264 19Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9502 16.5H12.0502V16.6H11.9502V16.5Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 9.5V13.5"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Warning;
