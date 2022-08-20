export const GET_FLOW_FEES_EDTIMATION = `
import FlowFees from 0xFlowFees
pub fun main(inclusionEffort: UFix64, executionEffort: UFix64): UFix64 {
    return FlowFees.computeFees(inclusionEffort: inclusionEffort, executionEffort:executionEffort);
}
`;
