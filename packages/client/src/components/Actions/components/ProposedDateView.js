import { parseTimestamp } from 'utils';

const ProposedDateView = ({ timestamp }) => (
  <div className="m-1 columns is-size-6 border-light-top border-light-bottom">
    <span className="column pl-0 has-text-grey">Proposed On</span>
    <div className="column pl-0">
      <span className="has-text-weight-bold has-text-black">
        {parseTimestamp(timestamp)}
      </span>
    </div>
  </div>
);

export default ProposedDateView;
