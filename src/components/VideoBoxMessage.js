import React from "react";
import CleanVideoBox from "./CleanVideoBox";
import ErrorVideoBox from "./ErrorVideoBox";

function VideoBoxMessage({ shouldShow, whatToShow }) {
  if (shouldShow) {
    return (
      <div className="row">
        <div className="col text-center">
          {whatToShow === "clean" ? <CleanVideoBox /> : <ErrorVideoBox />}
        </div>
      </div>
    );
  } else return null;
}

export default VideoBoxMessage;
