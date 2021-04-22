import React from "react";
import LogoSVG from "../images/RangeTube-Logo.svg";
import "./styles/Logo.css";

function Logo() {
  return (
    <>
      <div className="row logo-row">
        <div className="col text-center">
          <a href={window.location} onDragStart={(e) => e.preventDefault()}>
            <img
              src={LogoSVG}
              className="img-fluid"
              alt="Logo"
              draggable="false"
            />
          </a>
        </div>
      </div>
    </>
  );
}

export default Logo;
