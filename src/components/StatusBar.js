import React from "react";

function StatusBar({ state }) {
  let statusBarClasses = undefined;

  // Probably should make it a Switch statement
  if (state === "succesfull") {
    statusBarClasses = "progress-bar bg-success";
  } else if (state === "loading") {
    statusBarClasses =
      "progress-bar progress-bar-striped progress-bar-animated bg-warning";
  } else if (state === "error") {
    statusBarClasses = "progress-bar bg-danger";
  } else {
    statusBarClasses = "progress-bar bg-primary";
  }

  return (
    <div className="progress" style={{ borderRadius: "inherit" }}>
      <div className={statusBarClasses} style={{ width: "100%" }}></div>
    </div>
  );
}

export default StatusBar;
