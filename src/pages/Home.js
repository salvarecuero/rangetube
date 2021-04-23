import React, { useCallback, useEffect, useState } from "react";
import Logo from "../components/Logo";
import SearchBox from "../components/SearchBox";
import VideoBox from "../components/VideoBox";
import VideoControls from "../components/VideoControls";
import "./styles/Home.css";

function Home({ pageStatus, setPageStatus }) {
  const [videoID, setVideoID] = useState("");
  const [videoRelevantData, setVideoRelevantData] = useState({
    info: "",
  });
  const [playRange, setPlayRange] = useState({
    startSeconds: 0,
    endSeconds: undefined,
  });
  const [alreadySearched, setAlreadySearched] = useState(false);
  const [playerVirtualDOM, setPlayerVirtualDOM] = useState(null);

  // When the range changes we gotta reload the video with the new props, cause the player doesn't accept endSeconds-prop changes.
  useEffect(() => {
    playerVirtualDOM &&
      playerVirtualDOM.loadVideoById({
        videoId: videoID,
        startSeconds: playRange.startSeconds,
        endSeconds: playRange.endSeconds,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playRange]);

  useEffect(() => {
    if (playerVirtualDOM) {
      setPlayRange({
        startSeconds: 0,
        endSeconds: videoRelevantData.videoDuration,
      });
      playerVirtualDOM.playVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRelevantData]);

  // Play/Pause when keydown is spacebar
  const handleSpacebarPressed = useCallback(
    (event) => {
      if (playerVirtualDOM && event.key === " ") {
        playerVirtualDOM.getPlayerState() !== 1
          ? playerVirtualDOM.playVideo()
          : playerVirtualDOM.pauseVideo();
      }
    },
    [playerVirtualDOM]
  );

  useEffect(() => {
    playerVirtualDOM &&
      document.addEventListener("keyup", handleSpacebarPressed);
  }, [handleSpacebarPressed, playerVirtualDOM]);

  return (
    <>
      <div className="Home">
        <div className="container Home__container">
          <Logo />
          <SearchBox
            videoID={videoID}
            setVideoID={setVideoID}
            pageStatus={pageStatus}
            setPageStatus={setPageStatus}
            playerVirtualDOM={playerVirtualDOM}
          />
          <VideoBox
            videoID={videoID}
            videoRelevantData={videoRelevantData}
            setVideoRelevantData={setVideoRelevantData}
            playRange={playRange}
            searched={alreadySearched}
            setSearched={setAlreadySearched}
            pageStatus={pageStatus}
            setPageStatus={setPageStatus}
            playerVirtualDOM={playerVirtualDOM}
            setPlayerVirtualDOM={setPlayerVirtualDOM}
          />
          <VideoControls
            key={videoRelevantData.info.video_id} // It will reset the component when the video changes.
            player={playerVirtualDOM}
            searched={alreadySearched}
            pageStatus={pageStatus}
            setPageStatus={setPageStatus}
            videoDuration={videoRelevantData.videoDuration}
            playRange={playRange}
            setPlayRange={setPlayRange}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
