import React, { useState } from "react";
import Svg from "library/Svg";

function Tooltip({ position, text, children, classNames = "" }) {
  const positionConfig = {
    left: "has-tooltip-left",
    right: "has-tooltip-right",
    top: "has-tooltip-top",
    bottom: "has-tooltip-bottom",
  };
  const className = positionConfig[position] ?? "";
  return (
    <span
      className={`has-tooltip-arrow ${className} ${classNames}`}
      data-tooltip={text}
    >
      {children}
    </span>
  );
}

const TooltipWrapper = ({ isOpen, children }) => {
  if (isOpen) {
    return <>{children}</>;
  }
  return (
    <Tooltip
      classNames="is-flex is-flex-grow-1"
      position="top"
      text="Filter proposals based on status"
    >
      {children}
    </Tooltip>
  );
};

const Dropdown = ({
  value,
  values,
  setValue,
  style,
  renderItemAddOn,
  defaultText,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCloseDrowdown = () => {
    setIsOpen((status) => !status);
  };

  const closeOnBlur = () => {
    setIsOpen(false);
  };

  const dropdownClasses = [
    "dropdown is-right",
    "is-flex is-flex-grow-1",
    isOpen ? "is-active" : "",
  ];

  return (
    <div
      className={dropdownClasses.join(" ")}
      onBlur={closeOnBlur}
      aria-haspopup="true"
      aria-controls="dropdown-menu"
      style={style}
    >
      <div className="dropdown-trigger columns m-0 is-flex-grow-1">
        <button
          className="rounded-sm is-outlined border-light column m-0 py-0 px-3 is-full full-height has-background-white"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={openCloseDrowdown}
        >
          <TooltipWrapper isOpen={isOpen}>
            <div className="is-flex is-flex-grow-1 is-align-items-center is-justify-content-space-between has-text-grey small-text">
              {value ?? defaultText}
              <span>
                {renderItemAddOn && renderItemAddOn(value)}
                <Svg name="CaretDown" className="has-text-black" />
              </span>
            </div>
          </TooltipWrapper>
        </button>
      </div>
      <div
        className="dropdown-menu column p-0 is-full"
        id="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content py-0">
          {values.map((item, index) => {
            const { itemValue, displayText } = item;
            return (
              <button
                className={`button is-white dropdown-item has-text-grey${
                  itemValue === value ? " is-active" : ""
                }`}
                onMouseDown={() => setValue(itemValue)}
                key={`drop-down-${index}`}
              >
                <span className="is-flex is-flex-grow-1 is-align-items-center is-justify-content-space-between">
                  {displayText}
                  {renderItemAddOn && renderItemAddOn(itemValue)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
