import React from "react";
import ReactLoading from "react-loading";

function Loading({ isLoading }) {
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <ReactLoading
          type={"cylon"}
          color={"#435560"}
          height={"10%"}
          width={"10%"}
        />
      </div>
    );
  } else {
    return null;
  }
}

export default Loading;
