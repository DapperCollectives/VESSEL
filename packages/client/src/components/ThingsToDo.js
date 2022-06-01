import React from "react";
import ActionsList from "./ActionsList";

function ThingsToDo(props) {
  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Things to do</h4>
      </div>
      <ActionsList {...props} />
    </>
  );
}

export default ThingsToDo;
