import React, { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import VideoBox from "../components/VideoBox";
import VideoControls from "../components/VideoControls";
import "./styles/Home.css";

function Home() {
  let [videoURL, setVideoURL] = useState("");

  let [videoRelevantData, setVideoRelevantData] = useState({
    info: "",
  });

  let [playRange, setPlayRange] = useState({
    startSeconds: 0,
    endSeconds: undefined,
  });

  let [alreadySearched, setAlreadySearched] = useState(false);
  let [videoErrorState, setVideoErrorState] = useState(false);

  let [playerVirtualDOM, setPlayerVirtualDOM] = useState(null);

  let [isLoading, setIsLoading] = useState(true);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRelevantData]);

  return (
    <div className="Home h-100">
      <div className="container Home__container">
        <SearchBox
          setVideoURL={setVideoURL}
          setVideoErrorState={setVideoErrorState}
        />
        <VideoBox
          videoID={videoURL}
          videoRelevantData={videoRelevantData}
          setVideoRelevantData={setVideoRelevantData}
          playRange={playRange}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          searched={alreadySearched}
          setSearched={setAlreadySearched}
          videoErrorState={videoErrorState}
          setVideoErrorState={setVideoErrorState}
          playerVirtualDOM={playerVirtualDOM}
          setPlayerVirtualDOM={setPlayerVirtualDOM}
        />
        <VideoControls
          key={videoRelevantData.info.video_id} // It will reset the component when the video changes.
          player={playerVirtualDOM}
          searched={alreadySearched}
          videoErrorState={videoErrorState}
          videoDuration={videoRelevantData.videoDuration}
          playRange={playRange}
          setPlayRange={setPlayRange}
        />
      </div>
    </div>
  );
}

export default Home;
