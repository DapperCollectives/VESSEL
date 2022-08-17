import { useState } from "react";
import ReviewSafeEdits from "./ReviewSafeEdits";
import EditThresholdForm from "./EditThresholdForm";
const EditThreshold = ({ treasury, newOwner }) => {
  const [currStep, setCurrStep] = useState(0);
  if (currStep == 1) return <ReviewSafeEdits />;
  return <EditThresholdForm />;
};
export default EditThreshold;
