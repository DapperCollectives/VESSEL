import React, { useCallback, useState } from "react";
import Svg from "library/Svg";

/**
 *
 * Pass to the openModal the component and the configuration
 * openModal(
 *   content: (
 *     <div className="columns m-0 flex-1 has-background-orange">
 *       <div className="column">this is the modal content</div>
 *     </div>
 *   ),
 *   modalConfig: {
 *     closeOnBackgroundClick: boolean
 *     showCloseButton: boolean,
 *     classNameModalContent: string,
 *   }
 * );
 */
const ModalContext = React.createContext({});

export const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error("`useModalContext` must be used within a `ModalProvider`.");
  }
  return context;
};

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    // more configuration can be added here
    headerTitle: "",
    closeOnBackgroundClick: true,
    showCloseButton: true,
    classNameModalContent: "",
    onClose: () => {},
  });
  // const [modalHeader, setModalHeader] = useState(modalConfig.headerTitle)

  const setModalHeaderTitle = useCallback((title) => {
    console.log("SET MODAL HEADER TITLE")
    setModalConfig({...modalConfig, headerTitle: title})
  }, [modalConfig]);

  const openModal = useCallback(
    (content, customModalConfig) => {
      setModalConfig(() => ({
        ...modalConfig,
        // set default values if modal is re-opened without configuration
        // this is when two components are using the modal with different configuration at the same time
        closeOnBackgroundClick: true,
        showCloseButton: true,
        classNameModalContent: "",
        headerTitle: "",
        ...customModalConfig ?? {},
      }));

      setContent(content);
      setModal(true);
    },
    [modalConfig]
  );

  const closeModal = useCallback(() => {
    setModal(false);
    setContent(null);
    modalConfig.onClose();
  }, [modalConfig]);

  const { closeOnBackgroundClick } = modalConfig;
  const handleClickOnBackground = useCallback(() => {
    if (closeOnBackgroundClick) {
      closeModal();
    }
  }, [closeModal, closeOnBackgroundClick]);

  const providerProps = {
    openModal,
    closeModal,
    setModalHeaderTitle,
    isOpen: modal,
  };

  const className = `modal${modal ? " is-active" : ""}`;

  return (
    <ModalContext.Provider value={providerProps}>
      <>
        <div className={className}>
          <div
            className="modal-background"
            onClick={handleClickOnBackground}
          ></div>
          <div
            style={{ overflow: "visible" }}
            className={`modal-content rounded-sm ${
              modalConfig.backgroundColor
                ? modalConfig.backgroundColor
                : " has-background-white"
            } ${modalConfig.classNameModalContent}`}
          >
            {modalConfig.headerTitle && (
              <div className="p-5 border-light-bottom">
                <div className="is-flex has-text-black">
                  <div className="flex-1 is-size-4">
                    {modalConfig.headerTitle}
                  </div>
                  <div
                    onClick={closeModal}
                    style={{ width: 40 }}
                    className="pointer is-flex is-align-items-center is-justify-content-end"
                  >
                    <Svg name="Close" />
                  </div>
                </div>
              </div>
            )}
            {!!content ? content : <p>Empty Modal</p>}
          </div>
          {modalConfig.showCloseButton && (
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={closeModal}
            ></button>
          )}
        </div>
        {children}
      </>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
