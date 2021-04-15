import React, { useState } from "react";
import StatusBar from "../components/StatusBar";
import Home from "../pages/Home";
import Footer from "./Footer";

function App() {
  let [pageStatus, setPageStatus] = useState();

  return (
    <>
      <StatusBar state={pageStatus} />
      <Home pageStatus={pageStatus} setPageStatus={setPageStatus} />
      <Footer />
    </>
  );
}

export default App;
