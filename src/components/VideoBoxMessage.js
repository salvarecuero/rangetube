import React from "react";
import CleanVideoBox from "./CleanVideoBox";
import ErrorVideoBox from "./ErrorVideoBox";

function VideoBoxMessage({ shouldShow, whatToShow }) {
  if (shouldShow) {
    return (
      <div
        id="video-box-message"
        className={`d-flex text-center justify-content-center bg-${whatToShow}`}
      >
        <div className="align-self-center">
          {whatToShow === "clean" ? <CleanVideoBox /> : <ErrorVideoBox />}
        </div>
      </div>
    );
  } else return null;
}

export default VideoBoxMessage;
