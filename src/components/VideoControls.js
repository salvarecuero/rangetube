import React from "react";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

function VideoControls({
  player,
  searched,
  videoErrorState,
  videoDuration,
  playRange,
  setPlayRange,
}) {
  function handlePlayerVarsChange(values) {
    setPlayRange({
      startSeconds: values[0],
      endSeconds: values[1],
    });
  }

  function handleChangingValues(values) {
    playRange.startSeconds !== values[0]
      ? player.seekTo(values[0])
      : player.seekTo(values[1]);
  }

  if (searched && !videoErrorState && videoDuration) {
    return (
      <div className="row justify-content-center">
        <div className="col-4 text-center">
          <Range
            min={0}
            max={videoDuration}
            defaultValue={[0, videoDuration]}
            onChange={(values) => handleChangingValues(values)}
            onAfterChange={(values) => handlePlayerVarsChange(values)}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default VideoControls;
