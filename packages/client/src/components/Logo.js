import React from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Svg";

function LogoCpt(props) {
  return (
    <div className={props.className} style={props.style}>
      <NavLink to="/">
        <Logo />
      </NavLink>
    </div>
  );
}

export default LogoCpt;
