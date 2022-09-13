const Person = ({ width = "16", height = "32", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 16 16 16"
  >
    <circle cx="8" cy="27" r="4.5" fill="#fff" stroke="currentColor" />
    <path stroke="currentColor" d="M1 40v0c1.372-7.842 12.628-7.842 14 0v0" />
  </svg>
);
export default Person;
