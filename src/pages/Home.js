import React, { useEffect, useState, useCallback } from "react";
import Logo from "../components/Logo";
import SearchBox from "../components/SearchBox";
import VideoBox from "../components/VideoBox";
import VideoControls from "../components/VideoControls";
import "./styles/Home.css";

function Home({ pageStatus, setPageStatus }) {
  let [videoURL, setVideoURL] = useState("");

  let [videoRelevantData, setVideoRelevantData] = useState({
    info: "",
  });

  let [playRange, setPlayRange] = useState({
    startSeconds: 0,
    endSeconds: undefined,
  });

  let [alreadySearched, setAlreadySearched] = useState(false);

  let [playerVirtualDOM, setPlayerVirtualDOM] = useState(null);

  useEffect(() => {
    playerVirtualDOM &&
      playerVirtualDOM.loadVideoById({
        videoId: videoURL,
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

  const pauseVideoWhenSpacebarUp = useCallback((e) => {
    if (
      e.key === " " &&
      playerVirtualDOM &&
      playerVirtualDOM.getPlayerState() === 1
    ) {
      console.log("I pressed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", pauseVideoWhenSpacebarUp);
    return () =>
      document.removeEventListener("keyup", pauseVideoWhenSpacebarUp);
  }, [pauseVideoWhenSpacebarUp]);

  return (
    <>
      <div className="Home">
        <div className="container Home__container">
          <Logo />
          <SearchBox
            setVideoURL={setVideoURL}
            setPageStatus={setPageStatus}
            playerVirtualDOM={playerVirtualDOM}
          />
          <VideoBox
            videoID={videoURL}
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
