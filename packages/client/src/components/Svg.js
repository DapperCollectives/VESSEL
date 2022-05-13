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
    width={24}
    height={24}
    className={className}
    fill="none"
    viewBox="0 0 24 24"
  >
    <rect width="24" height="24" fill="#22AA0D" rx="12" />
    <path stroke="#fff" d="M5 13l5 4 8-9" />
  </svg>
);
