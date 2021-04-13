import React from "react";

function ErrorVideoBox() {
  return (
    <div className="alert alert-danger" role="alert">
      <h2 className="alert-heading">Video not loaded yet!</h2>
      <p>There's a problem with your video.</p>
    </div>
  );
}

export default ErrorVideoBox;
