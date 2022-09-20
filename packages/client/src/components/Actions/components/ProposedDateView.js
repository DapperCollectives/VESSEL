import { parseTimestamp } from "utils";

const ProposedDateView = ({ timestamp }) => {
  return (
    <>
      <div className="mt-4 border-light-top">
        <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
          <span className="flex-1 has-text-grey">Proposed On</span>
          <div className="flex-1">
            <span className="has-text-weight-bold has-text-black">
              {parseTimestamp(timestamp)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposedDateView;
