const Plus = ({ width = '16', height = '16', className = '', style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    width={width}
    height={height}
    className={className}
    style={style}
  >
    <rect width="1" height="16" x="7.5" fill="currentColor" rx="0.5" />
    <rect
      width="1"
      height="16"
      y="8.5"
      fill="currentColor"
      rx="0.5"
      transform="rotate(-90 0 8.5)"
    />
  </svg>
);
export default Plus;
