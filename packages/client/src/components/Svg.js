export const Logo = ({
  width = "114",
  height = "28",
  className = "",
  style = {},
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 114 28"
  >
    <path
      fill="currentColor"
      d="M112.848 1.268a5.299 5.299 0 00-3.735-1.26H0v22.595c0 2.273.28 3.218 1.152 4.127a5.194 5.194 0 003.735 1.26H114V5.36c0-2.239-.279-3.218-1.152-4.092zM24.958 18.44c-.943 3.672-2.13 4.966-4.538 4.966-2.409 0-3.666-1.294-4.503-4.197L11.728 4.555h6.248l3.281 11.612a.7.7 0 001.116.392.7.7 0 00.245-.392L25.62 4.555h2.897l-3.56 13.886zM42.41 7.179h-4.643c-1.536 0-2.094.594-2.094 2.203v3.008h6.073v2.658h-6.073v3.498c0 1.714.28 1.959 1.99 1.959h4.083v2.623h-7.818c-2.967 0-4.224-1.085-4.224-3.498V9.137a3.82 3.82 0 011.114-3.23 3.803 3.803 0 013.25-1.037h8.342V7.18zm29.425 0H66.32c-2.095 0-2.863.42-2.863 1.573 0 1.155.768 1.504 2.653 1.89a9.654 9.654 0 013.49 1.188 5.49 5.49 0 012.235 4.582 6.306 6.306 0 01-.946 3.314 6.287 6.287 0 01-2.545 2.317 10.07 10.07 0 01-5.27.945H43.98v-2.623h4.887a4.18 4.18 0 002.409-.42 1.958 1.958 0 00.802-1.644c0-1.47-.802-2.064-3.49-2.518a8.122 8.122 0 01-3.805-1.364 5.243 5.243 0 01-1.85-4.058 5.745 5.745 0 01.971-3.126 5.727 5.727 0 012.52-2.085 11.915 11.915 0 015.166-.595h19.93l.315 2.624zm15.009 15.809h-8.831c-3.002 0-4.224-1.084-4.224-3.498V8.997a3.82 3.82 0 011.104-3.213 3.804 3.804 0 013.225-1.054h8.377v2.623h-4.642c-1.536 0-2.095.595-2.095 2.204v3.008h6.074v2.658h-6.074v3.498c0 1.713.244 1.958 1.955 1.958h5.13v2.309zm15.498 0h-8.203a5.16 5.16 0 01-3.7-1.26c-.873-.874-1.152-1.783-1.152-4.057V4.555h5.969v13.116c0 2.344.349 2.694 2.618 2.694h4.468v2.623z"
    />
    <path
      fill="currentColor"
      d="M59.337 14.419a5.384 5.384 0 01-1.85-4.057A5.815 5.815 0 0158.5 7.179h-6.457c-2.094 0-2.862.42-2.862 1.574 0 1.154.768 1.504 2.653 1.888a9.69 9.69 0 013.49 1.19 5.419 5.419 0 012.269 4.581 6.373 6.373 0 01-1.431 3.953h7.155a4.041 4.041 0 002.374-.42 1.957 1.957 0 00.803-1.644c0-1.469-.803-2.063-3.49-2.518a8.122 8.122 0 01-3.666-1.364z"
    />
  </svg>
);

export const Plus = ({
  width = "16",
  height = "16",
  className = "",
  style = {},
}) => (
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

export const CaretDown = ({ width = "30", height = "15", className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="caret-down"
      className={`svg-inline--fa fa-caret-down ${className}`}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
    >
      <path
        fill="currentColor"
        d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
      ></path>
    </svg>
  );
};

export const Trash = ({ width = "20", height = "17", className = "" }) => (
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

export const Person = ({ width = "16", height = "32", className = "" }) => (
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

export const Minus = ({ width = "48", height = "48", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 48 48"
  >
    <path stroke="currentColor" d="M16 24h16" />
  </svg>
);

export const ArrowDown = ({ width = "12", height = "12", className = "" }) => (
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

export const ArrowUp = ({ width = "12", height = "12", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 12 12"
  >
    <path stroke="currentColor" d="M11 11V1H1M11 1L1 11"></path>
  </svg>
);

export const Search = ({ width = "17", height = "17", className = "" }) => (
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

export const Check = ({ width = "24", height = "24", className = "" }) => (
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

export const Warning = ({ width = "24", height = "25", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 24 25"
  >
    <path d="M21.5264 19L12.8661 4C12.4812 3.33333 11.519 3.33333 11.1341 4L2.47385 19C2.08895 19.6667 2.57007 20.5 3.33987 20.5H20.6604C21.4302 20.5 21.9113 19.6667 21.5264 19Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.9502 16.5H12.0502V16.6H11.9502V16.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9.5V13.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const OpenNewTab = ({ width = "18", height = "18", className = "" }) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 18 18"
  >
    <path d="M17 6.33334L17 1.00001M17 1.00001H11.6666M17 1.00001L9 9M7.22222 1H5.26667C3.77319 1 3.02646 1 2.45603 1.29065C1.95426 1.54631 1.54631 1.95426 1.29065 2.45603C1 3.02646 1 3.77319 1 5.26667V12.7333C1 14.2268 1 14.9735 1.29065 15.544C1.54631 16.0457 1.95426 16.4537 2.45603 16.7094C3.02646 17 3.77319 17 5.26667 17H12.7333C14.2268 17 14.9735 17 15.544 16.7094C16.0457 16.4537 16.4537 16.0457 16.7094 15.544C17 14.9735 17 14.2268 17 12.7333V10.7778" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

export const Copy = ({ width = "18", height = "18", className = "" }) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 18 19"
  >
    <path d="M10.5 5.75V5.5C10.5 4.55719 10.5 4.08579 10.2071 3.79289C9.91421 3.5 9.44281 3.5 8.5 3.5H5C4.05719 3.5 3.58579 3.5 3.29289 3.79289C3 4.08579 3 4.55719 3 5.5V9C3 9.94281 3 10.4142 3.29289 10.7071C3.58579 11 4.05719 11 5 11H5.25" stroke="black" />
    <rect x="7.5" y="8" width="7.5" height="7.5" rx="1" stroke="black" />
  </svg>
