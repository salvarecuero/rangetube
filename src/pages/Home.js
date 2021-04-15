import React, { useEffect, useState } from "react";
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRelevantData]);

  return (
    <>
      <div className="Home h-100">
        <div className="container Home__container">
          <SearchBox setVideoURL={setVideoURL} setPageStatus={setPageStatus} />
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
