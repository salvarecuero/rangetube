import React, { useState } from "react";

function SearchBox({ setVideoURL, setPageStatus }) {
  let [searchValue, setSearchValue] = useState("");

  function handleSearchSubmit() {
    if (searchValue) {
      console.log("hmmm");
      const newID = parseIdFromURL(searchValue);

      newID
        ? setVideoURL(newID) && setPageStatus("loading")
        : setPageStatus("error") &&
          document.getElementById("yt-iframe").classList.add("d-none");
    } else {
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
            type="text"
            className="form-control"
            placeholder="Insert here your YouTube video URL..."
            aria-label="Insert here your YouTube video URL..."
            aria-describedby="button-addon2"
            required
          />
          <div className="input-group-append">
            <button
              onClick={handleSearchSubmit}
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
