import React from "react";

function ErrorVideoBox() {
  return (
    <>
      <h2 className="alert-heading">Oops! There was an error... :(</h2>
      <p>
        Make sure you entered a valid YouTube video URL or that you have the
        permission to watch this video (i.e it's not a private video).
      </p>
    </>
  );
}

export default ErrorVideoBox;
