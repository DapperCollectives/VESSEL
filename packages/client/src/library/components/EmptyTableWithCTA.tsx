import * as React from 'react';

interface IEmptyTableWithCTAProps {
  header?: string;
  message?: string;
  onButtonClick?: () => void;
  buttonText?: string;
  buttonIcon?: React.ReactElement;
}
const EmptyTableWithCTA: React.FC<IEmptyTableWithCTAProps> = ({
  header,
  message,
  onButtonClick,
  buttonText,
  buttonIcon,
}) => (
  <section
    className="section is-flex is-align-items-center has-background-white-ter mt-4 rounded-lg"
    style={{ height: 'calc(100vh - 340px)' }}
  >
    <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center has-text-black">
      {header && <h2>{header}</h2>}
      {message && <p className="has-text-grey">{message}</p>}
      {buttonText && (
        <button
          type="button"
          className={`button is-primary is-small mt-4 ${
            buttonIcon ? 'with-icon' : ''
          }`}
          onClick={onButtonClick}
        >
          {buttonText}
          {buttonIcon}
        </button>
      )}
    </div>
  </section>
);
export default EmptyTableWithCTA;
