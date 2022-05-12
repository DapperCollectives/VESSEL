import React from "react";
import { isEmpty } from "lodash";

function SafeAssets(props) {
  let AssetsComponent = null;
  if (isEmpty(props.assets)) {
    AssetsComponent = (
      <div
        style={{
          height: "calc(100vh - 260px)",
        }}
        className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
      >
        <h2 className="is-size-4">You don't have any stored assets</h2>
        <p className="has-text-grey">
          Transfer them to this safe to preview here
        </p>
      </div>
    );
  }

  return AssetsComponent;
}

export default SafeAssets;
