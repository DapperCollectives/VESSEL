import React, { useEffect, useRef, useState } from 'react';
import Svg from 'library/Svg';

const Dropdown = ({
  selectedValue,
  options = [],
  setOption = () => {},
  renderOption = () => {},
  defaultText = 'Select one',
  renderCustomSearchOrInput,
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValueDisplay, setSelectedValueDisplay] = useState(defaultText);
  const ref = useRef(null);

  const openCloseDrowdown = () => {
    setIsOpen((status) => !status);
  };

  useEffect(() => {
    (() => {
      if (selectedValue) {
        const selectedOption = options.find(
          ({ itemValue }) => itemValue === selectedValue
        );
        setSelectedValueDisplay(
          renderOption(
            selectedValue,
            selectedOption?.displayText,
            selectedOption?.attr
          )
        );
      } else {
        setSelectedValueDisplay(defaultText);
      }
    })();
  }, [selectedValue, renderOption]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div
      className={`dropdown is-right is-flex is-flex-direction-column ${
        isOpen ? 'is-active' : ''
      }`}
      aria-haspopup="true"
      aria-controls="dropdown-menu"
      style={{ height: '58px', ...style }}
      ref={ref}
    >
      <div className="dropdown-trigger m-0 flex-1 is-flex">
        <button
          type="button"
          className="rounded-sm border-light flex-1 m-0 py-0 px-3 full-height has-background-white"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={openCloseDrowdown}
        >
          <div className="is-flex is-align-items-center is-justify-content-space-between has-text-grey small-text">
            <div className="is-flex-grow-1 mr-2 has-text-left has-text-black">
              {selectedValueDisplay}
            </div>
            <Svg name="CaretDown" />
          </div>
        </button>
      </div>
      <div
        className="dropdown-menu flex-1 p-0"
        style={{ width: '100%' }}
        id="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content py-0">
          {renderCustomSearchOrInput && renderCustomSearchOrInput()}
          {options.map((option) => {
            const { itemValue, displayText, attr } = option;
            return (
              <button
                type="button"
                className={`border-none dropdown-item has-text-grey${
                  itemValue === selectedValue ? ' is-active' : ''
                }`}
                onMouseDown={() => {
                  setOption(itemValue);
                  openCloseDrowdown();
                }}
                key={`drop-down-${itemValue}`}
              >
                {renderOption(itemValue, displayText, attr)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
