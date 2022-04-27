import React from "react";
import IntentList from "./IntentList";

function ThingsToDo(props) {
  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Things to do</h4>
      </div>
      <IntentList {...props} />
    </>
  );
}

export default ThingsToDo;
