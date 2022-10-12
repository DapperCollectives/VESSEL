import React from 'react';
import { NavLink } from 'react-router-dom';
import Svg from 'library/Svg';

function LogoCpt(props) {
  return (
    <div className={props.className} style={props.style}>
      <NavLink to="/">
        <Svg name="Logo" />
      </NavLink>
    </div>
  );
}

export default LogoCpt;
