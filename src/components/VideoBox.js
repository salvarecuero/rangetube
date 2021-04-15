import React, { useEffect, useState } from "react";
import YouTube from "@u-wave/react-youtube";
import VideoBoxMessage from "./VideoBoxMessage";

function VideoBox({
  videoID,
  videoRelevantData,
  setVideoRelevantData,
  playRange,
  searched,
  setSearched,
  pageStatus,
  setPageStatus,
  setPlayerVirtualDOM,
}) {
  let [messageToShow, setMessageToShow] = useState();

  useEffect(() => {
    if (pageStatus && pageStatus !== "error") {
      setMessageToShow();
    } else if (pageStatus && pageStatus === "error") {
      setMessageToShow("error");
    } else {
      setMessageToShow("clean");
    }
  }, [pageStatus]);

  function handleReady(event) {
    setPlayerVirtualDOM(event.target);
  }

  function handlePlaying(event) {
    handleSetVideoData(event.target);
    document.getElementById("yt-iframe").classList.remove("d-none");
    !searched && setSearched(true);
    setPageStatus("succesfull");
  }

  function handleEnding(event) {
    event.data === 0 && event.target.seekTo(playRange.startSeconds);
  }

  function handleError() {
    document.getElementById("yt-iframe").classList.add("d-none");
    videoID && setPageStatus("error") && !searched && setSearched(true);
  }

  function handleSetVideoData(player) {
    if (videoRelevantData.info.video_id !== player.getVideoData().video_id) {
      setVideoRelevantData({
        info: player.getVideoData(),
        videoDuration: player.getDuration(),
      });
    }
  }

  return (
    <React.Fragment>
      <VideoBoxMessage
        shouldShow={!!messageToShow}
        whatToShow={messageToShow}
      />
      <div className="row">
        <div className="col text-center">
          <YouTube
            id="yt-iframe"
            className="d-none"
            video={videoID}
            width="640"
            height="390"
            autoplay={true}
            startSeconds={playRange.startSeconds}
            endSeconds={playRange.endSeconds ? playRange.endSeconds : undefined}
            onPlaying={handlePlaying}
            onStateChange={handleEnding}
            onReady={handleReady}
            onError={handleError}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default VideoBox;
