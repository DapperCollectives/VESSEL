import React from "react";
import { Close } from "./Svg";
import { useModalContext } from "contexts";

function ModalHeader({ title, className }) {
  const modalContext = useModalContext();
  return (
    <div className={className}>
      <div className="is-flex">
        <div className="flex-1 is-size-4">
          {title} 
        </div>
        <div 
          onClick={modalContext.closeModal}
          style={{ width: 40 }} 
          className="pointer is-flex is-align-items-center is-justify-content-end">
          <Close />
        </div>
      </div>
    </div>
  );
}

export default ModalHeader;