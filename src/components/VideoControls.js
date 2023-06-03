import React, { useState, useEffect, useCallback } from "react";
import Slider from "rc-slider";
import useDebounce from "../hooks/useDebounce";
import "./styles/VideoControls.css";

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
  const [currentRange, setCurrentRange] = useState([0, videoDuration]);
  const debouncedRange = useDebounce(currentRange, 300);

  const handlePlayerVarsChange = useCallback(
    (values) => {
      setPageStatus("loading");
      setPlayRange({
        startSeconds: values[0],
        endSeconds: values[1],
      });
    },
    [setPageStatus, setPlayRange]
  );

  useEffect(
    () => handlePlayerVarsChange(currentRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedRange, handlePlayerVarsChange, setPageStatus, setPlayRange]
  );

  function handleChangingValues(values) {
    setPageStatus("loading");
    playRange.startSeconds !== values[0]
      ? player.seekTo(values[0], false)
      : player.seekTo(values[1], false);

    setCurrentRange(values);
  }

  if (searched && pageStatus !== "error" && videoDuration) {
    return (
      <div className="row justify-content-center py-5">
        <div className="col text-center">
          <Range
            min={0}
            max={videoDuration}
            step={1}
            defaultValue={[0, videoDuration]}
            value={currentRange}
            onChange={(values) => handleChangingValues(values)}
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
