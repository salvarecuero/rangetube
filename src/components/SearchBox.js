import React, { useState } from "react";
import "./styles/SearchBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faAsterisk } from "@fortawesome/free-solid-svg-icons";

function SearchBox({ setVideoURL, setPageStatus, playerVirtualDOM }) {
  let [searchValue, setSearchValue] = useState("");
  const demoVideoURL = "https://www.youtube.com/watch?v=OPf0YbXqDm0";

  function handleSearchSubmit() {
    const newID = parseIdFromURL(searchValue);

    if (newID) {
      playerVirtualDOM.stopVideo();
      playerVirtualDOM.clearVideo();
      setVideoURL(newID);
      setPageStatus("loading");
    } else {
      playerVirtualDOM.stopVideo();
      playerVirtualDOM.clearVideo();
      setPageStatus("error");
    }
  }

  function parseIdFromURL(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  }

  return (
    <div className="row justify-content-center p-2">
      <div className="col-6">
        <div className="input-group mb-3">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            type="text"
            id="search-input"
            className="form-control"
            placeholder="Insert here your YouTube video URL..."
            aria-label="Insert here your YouTube video URL..."
            required
          />
          <div className="input-group-append">
            <button
              id="search-button"
              type="button"
              className="btn"
              onClick={searchValue ? handleSearchSubmit : null}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button
              id="demo-video-button"
              type="button"
              className="btn b-0"
              title="Set a demo video for test purposes :)"
              onClick={() => setSearchValue(demoVideoURL)}
            >
              <FontAwesomeIcon icon={faAsterisk} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
