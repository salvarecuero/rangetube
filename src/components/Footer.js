import React from "react";
import "./styles/Footer.css";

function Footer() {
  return (
    <div className="row Footer__bg m-0 p-1">
      <div className="col Footer__text text-center">
        Made with <span className="text-danger">♥</span> by{" "}
        <a
          className="text-white font-weight-bold"
          href="https://www.twitter.com/salvarecuero"
        >
          @salvarecuero
        </a>{" "}
        | Enjoy it!
      </div>
    </div>
  );
}

export default Footer;
