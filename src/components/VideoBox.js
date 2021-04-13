import React, { useEffect, useState } from "react";
import YouTube from "@u-wave/react-youtube";

import Loading from "./Loading";
import VideoBoxMessage from "./VideoBoxMessage";

function VideoBox({
  videoID,
  videoRelevantData,
  setVideoRelevantData,
  playRange,
  isLoading,
  setIsLoading,
  searched,
  setSearched,
  videoErrorState,
  setVideoErrorState,
  playerVirtualDOM,
  setPlayerVirtualDOM,
}) {
  let [messageToShow, setMessageToShow] = useState();

  useEffect(() => {
    if (!isLoading && searched && !videoErrorState && playerVirtualDOM) {
      setMessageToShow();
    } else if (
      !isLoading &&
      searched &&
      (videoErrorState || !playerVirtualDOM)
    ) {
      setMessageToShow("error");
    } else if (!isLoading && !searched && playerVirtualDOM) {
      setMessageToShow("clean");
    }
  }, [playerVirtualDOM, searched, videoErrorState, isLoading]);

  function handleReady(event) {
    setPlayerVirtualDOM(event.target);
    setIsLoading(false);
  }

  function handlePlaying(event) {
    handleSetVideoData(event.target);
    document.getElementById("yt-iframe").classList.remove("d-none");
    !searched && setSearched(true);
    setIsLoading(false);
    setVideoErrorState(false);
  }

  function handleEnding(event) {
    event.data === 0 && event.target.seekTo(playRange.startSeconds);
  }

  function handleError() {
    document.getElementById("yt-iframe").classList.add("d-none");
    videoID && setVideoErrorState(true) && !searched && setSearched(true);
    setIsLoading(false);
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
      <Loading isLoading={isLoading} />
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
