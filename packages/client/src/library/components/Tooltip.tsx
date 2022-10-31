import React, { useState } from 'react';

export enum ToolTipPositionEnum {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom',
}
export interface ITooltipProps {
  position: ToolTipPositionEnum;
  text: string;
  className?: string;
  children: JSX.Element;
}

const Tooltip: React.FC<ITooltipProps> = ({
  position = ToolTipPositionEnum.TOP,
  text,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const positionConfig = {
    left: 'has-tooltip-left',
    right: 'has-tooltip-right',
    top: 'has-tooltip-top',
    bottom: 'has-tooltip-bottom',
  };
  const positionClass = positionConfig[position];
  return (
    <span
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
    </span>
  );
};
export default Tooltip;
