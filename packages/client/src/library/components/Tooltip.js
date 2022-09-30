import { useState } from "react";

const Tooltip = ({ position = "top", text, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const positionConfig = {
    left: "has-tooltip-left",
    right: "has-tooltip-right",
    top: "has-tooltip-top",
    bottom: "has-tooltip-bottom",
  };
  const positionClass = positionConfig[position];
  return (
    <div
      className={`tooltip-container ${className}`}
      onMouseEnter={() => {
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        setIsOpen(false);
      }}
    >
      {children}
      {isOpen && <span className={`is-size-7 ${positionClass}`}>{text}</span>}
    </div>
  );
};
export default Tooltip;
