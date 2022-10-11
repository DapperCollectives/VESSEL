const Search = ({ width = '17', height = '17', className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 17 17"
  >
    <g stroke="currentColor">
      <path d="M11 11l5 5" />
      <rect width="13" height="13" x="0.5" y="0.5" fill="#fff" rx="6.5" />
    </g>
  </svg>
);
export default Search;
