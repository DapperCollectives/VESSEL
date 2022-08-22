import { query } from "@onflow/fcl";
import { GET_FLOW_FEES_ESTIMATION } from "../flow";
import {
  EXECUTION_EFFORTS,
  DEFAULT_INCLUSION_EFFORT,
} from "constants/constantValues";

const useFlowFees = () => {
  const getEstimation = async () => {
    const { PROPOSE_ACTION, SIGN_ACTION, EXECUTE_ACTION } = EXECUTION_EFFORTS;
    const executionEffort = PROPOSE_ACTION + SIGN_ACTION + EXECUTE_ACTION;
    const estimate = await query({
      cadence: GET_FLOW_FEES_ESTIMATION,
      args: (arg, t) => [
        arg(DEFAULT_INCLUSION_EFFORT, t.UFix64),
        arg(executionEffort, t.UFix64),
      ],
    }).catch(console.error);
    return `${estimate * 0.9} - ${estimate * 1.1}`;
  };
  return { getEstimation };
};

export default useFlowFees;
