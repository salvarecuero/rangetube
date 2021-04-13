import React from "react";
import "./styles/Navbar.css";

function Navbar() {
  return (
    <div className="row Navbar__bg m-0">
      <div className="col text-center">
        <a href={window.location}>
          <h1 className="Navbar__title">
            [Youtube Play <span className="text-danger">A-B</span> Range]
          </h1>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
