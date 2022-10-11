import { useContext } from 'react';
import { useModalContext } from 'contexts';
import Svg from 'library/Svg';
import { TransferTokensContext } from '../TransferTokensContext';

const ModalHeader = ({ title }) => {
  const [sendModalState] = useContext(TransferTokensContext);
  const { closeModal } = useModalContext();
  const { currentStep } = sendModalState;
  const titleText = currentStep === 0 ? title : 'Review';
  return (
    <>
      <div className="p-5 border-light-bottom">
        <div className="is-flex has-text-black">
          <div className="flex-1 is-size-4">{titleText}</div>
          <button
            type="button"
            onClick={closeModal}
            style={{ width: 40 }}
            className="pointer border-none has-background-white"
          >
            <Svg name="Close" />
          </button>
        </div>
      </div>
    </>
  );
};
export default ModalHeader;
