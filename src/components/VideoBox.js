import React, { useEffect, useState } from "react";
import YouTube from "@u-wave/react-youtube";
import VideoBoxMessage from "./VideoBoxMessage";
import "./styles/VideoBox.css";

// YT Iframe documentation: https://developers.google.com/youtube/iframe_api_reference
// React-Youtube: https://github.com/u-wave/react-youtube/tree/default/example

function VideoBox({
  videoID,
  videoRelevantData,
  setVideoRelevantData,
  playRange,
  searched,
  setSearched,
  pageStatus,
  setPageStatus,
  playerVirtualDOM,
  setPlayerVirtualDOM,
}) {
  const [messageToShow, setMessageToShow] = useState();

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
    setPlayerVirtualDOM(event.target); // When the player is loaded (and ready) we save it in a state so we can use methods conveniently
  }

  function handlePlaying(event) {
    handleSetVideoData(event.target);
    playerVirtualDOM.getPlayerState() === 2 && playerVirtualDOM.playVideo(); // PlayerState === 2 it means the video is paused
    !searched && setSearched(true);
    setPageStatus("succesfull");
  }

  function handleEnding(event) {
    event.data === 0 && event.target.seekTo(playRange.startSeconds); // event.data === 0 is the stateChange triggered when the video ends
  }

  function handleError() {
    videoID &&
      setPageStatus("error") &&
      playerVirtualDOM.clearVideo() &&
      !searched &&
      setSearched(true);
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
    <>
      <VideoBoxMessage
        shouldShow={!!messageToShow}
        whatToShow={messageToShow}
      />
      <div
        id="video-box"
        className={`p-2 justify-content-center ${
          pageStatus === "succesfull" || (pageStatus === "loading" && videoID)
            ? "d-flex embed-responsive-item"
            : "d-none"
        }`}
      >
        <div className="w-50 embed-responsive embed-responsive-16by9">
          <YouTube
            id="yt-iframe"
            video={videoID}
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
    </>
  );
}

export default VideoBox;
