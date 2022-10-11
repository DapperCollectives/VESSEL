import {
  DEFAULT_INCLUSION_EFFORT,
  EXECUTION_EFFORTS,
} from 'constants/constantValues';
import { query } from '@onflow/fcl';
import { GET_FLOW_FEES_ESTIMATION } from '../flow';

const useFlowFees = () => {
  const getProposeSendTokenEstimation = async () => {
    const { PROPOSE_ACTION } = EXECUTION_EFFORTS;
    const executionEffort = PROPOSE_ACTION;
    const estimate = await query({
      cadence: GET_FLOW_FEES_ESTIMATION,
      args: (arg, t) => [
        arg(DEFAULT_INCLUSION_EFFORT, t.UFix64),
        arg(executionEffort, t.UFix64),
      ],
    }).catch(console.error);
    return Number(estimate).toFixed(6);
  };
  return { getProposeSendTokenEstimation };
};

export default useFlowFees;
