import React from "react";
import ActionsList from "./Actions/ActionsList";

function ThingsToDo(props) {
  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h2>Things to do</h2>
      </div>
      <ActionsList {...props} />
    </>
  );
}

export default ThingsToDo;
