import { parseTimestamp } from "utils";

const ProposedDateView = ({ timestamp }) => {
  return (
    <div className="m-1 columns is-size-6 border-light-top border-light-bottom">
      <span className="column has-text-grey">Proposed On</span>
      <div className="column">
        <span className="has-text-weight-bold has-text-black">
          {parseTimestamp(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ProposedDateView;
