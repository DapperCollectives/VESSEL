import React, { useEffect, useRef, useState } from 'react';
import Svg from 'library/Svg';

export interface IDropDownOption {
  itemValue: string | number;
  displayText: string | undefined;
  attr: { [key: string]: unknown } | undefined;
}
export interface IDropdownProps {
  selectedValue: string;
  options: IDropDownOption[];
  setOption: (itemValue: string | number) => void;
  renderOption: (option: IDropDownOption) => JSX.Element;
  defaultText?: string;
  renderCustomSearchOrInput: () => JSX.Element;
  style?: React.CSSProperties;
}
const Dropdown: React.FC<IDropdownProps> = ({
  selectedValue,
  options = [],
  setOption = () => {},
  renderOption = () => null,
  defaultText = 'Select one',
  renderCustomSearchOrInput,
  style,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValueDisplay, setSelectedValueDisplay] =
    useState<React.ReactNode>(defaultText);
  const ref = useRef<HTMLDivElement>(null);

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
          renderOption({
            itemValue: selectedValue,
            displayText: selectedOption?.displayText,
            attr: selectedOption?.attr,
          })
        );
      } else {
        setSelectedValueDisplay(defaultText);
      }
    })();
  }, [selectedValue, renderOption]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e?.target as Node)) {
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
          <>
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
                  {renderOption({ itemValue, displayText, attr })}
                </button>
              );
            })}
          </>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
