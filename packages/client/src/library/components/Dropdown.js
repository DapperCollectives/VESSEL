import React, { useState } from "react";
import Svg from "library/Svg";

// function Tooltip({ position, text, children, classNames = "" }) {
//   const positionConfig = {
//     left: "has-tooltip-left",
//     right: "has-tooltip-right",
//     top: "has-tooltip-top",
//     bottom: "has-tooltip-bottom",
//   };
//   const className = positionConfig[position] ?? "";
//   return (
//     <span
//       className={`has-tooltip-arrow ${className} ${classNames}`}
//       data-tooltip={text}
//     >
//       {children}
//     </span>
//   );
// }

// const TooltipWrapper = ({ isOpen, children }) => {
//   if (isOpen) {
//     return <>{children}</>;
//   }
//   return (
//     <Tooltip
//       classNames="is-flex is-flex-grow-1"
//       position="top"
//       text="Filter proposals based on status"
//     >
//       {children}
//     </Tooltip>
//   );
// };

const Dropdown = ({
  selectedValue,
  options = [],
  setOption = () => {},
  renderOption = () => {},
  defaultText = "Select one",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCloseDrowdown = () => {
    setIsOpen((status) => !status);
  };

  const closeOnBlur = () => {
    setIsOpen(false);
  };
  const getOptionByValue = (v) =>
    options.find((option) => option.itemValue === v);

  const dropdownClasses = [
    "dropdown is-right",
    "is-flex is-flex-grow-1",
    isOpen ? "is-active" : "",
  ];
  // const dropdownClasses = [
  //   "dropdown is-right",
  //   "is-flex is-flex-grow-1",
  //   "is-active",
  // ];

  return (
    <div
      className={dropdownClasses.join(" ")}
      onBlur={closeOnBlur}
      aria-haspopup="true"
      aria-controls="dropdown-menu"
      style={{ height: "58px" }}
    >
      <div className="dropdown-trigger columns m-0 is-flex-grow-1">
        <button
          type="button"
          className="rounded-sm border-light column m-0 py-0 px-3 is-full full-height has-background-white"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={openCloseDrowdown}
        >
          <div className="is-flex is-align-items-center is-justify-content-space-between has-text-grey small-text">
            <div className="is-flex-grow-1 mr-2 has-text-left has-text-black">
              {selectedValue
                ? renderOption(getOptionByValue(selectedValue))
                : defaultText}
            </div>
            <Svg name="CaretDown" />
          </div>
        </button>
      </div>
      <div
        className="dropdown-menu column p-0 is-full"
        id="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content py-0">
          {options.map((option) => {
            const { itemValue } = option;
            return (
              <button
                type="button"
                className={`border-none dropdown-item has-text-grey${
                  itemValue === selectedValue ? " is-active" : ""
                }`}
                onMouseDown={() => setOption(itemValue)}
                key={`drop-down-${itemValue}`}
              >
                {renderOption(option)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
