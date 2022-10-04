import { useModalContext } from "contexts";
import Svg from "library/Svg";
import { ErrorModal } from "modals";
import { useEffect, useState } from "react";

export default function useErrorMessage() {
  const { openModal, closeModal } = useModalContext();
  const [error, setError] = useState();

  const showErrorModal = (error) => {
    setError(error);
  };

  const closeErrorModal = () => {
    setError();
    closeModal();
  };

  useEffect(() => {
    if (error) {
      openModal(<ErrorModal error={error} onClose={closeErrorModal} />, {
        headerTitle: (
          <div className="is-flex is-align-items-center">
            <Svg name="Warning" className="mr-1" /> Error
          </div>
        ),
      });
    }
    // eslint-disable-next-line
  }, [error]);

  return { showErrorModal };
}
