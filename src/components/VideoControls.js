import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/modifiedIndex.css";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

function VideoControls({
  player,
  searched,
  pageStatus,
  setPageStatus,
  videoDuration,
  playRange,
  setPlayRange,
}) {
  function handlePlayerVarsChange(values) {
    setPageStatus("loading");
    setPlayRange({
      startSeconds: values[0],
      endSeconds: values[1],
    });
  }

  function handleChangingValues(values) {
    setPageStatus("loading");
    playRange.startSeconds !== values[0]
      ? player.seekTo(values[0], false)
      : player.seekTo(values[1], false);
  }

  if (searched && pageStatus !== "error" && videoDuration) {
    return (
      <div className="row justify-content-center pb-5">
        <div className="col text-center">
          <Range
            min={0}
            max={videoDuration}
            step={1}
            defaultValue={[0, videoDuration]}
            onChange={(values) => handleChangingValues(values)}
            onAfterChange={(values) => handlePlayerVarsChange(values)}
            tipFormatter={(value) => {
              return new Date(1000 * value).toISOString().substr(11, 8);
            }}
            tipProps={{
              placement: "bottom",
              visible: true,
              prefixCls: "rc-slider-tooltip",
            }}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default VideoControls;
