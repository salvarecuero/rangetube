import React, { useState, useEffect } from "react";
import StatusBar from "../components/StatusBar";
import Home from "../pages/Home";
import Footer from "./Footer";
import { startPortfolioReady } from "../portfolioEmbed";

function App() {
  const [pageStatus, setPageStatus] = useState();

  useEffect(() => {
    startPortfolioReady();
  }, []);

  return (
    <>
      <StatusBar state={pageStatus} />
      <Home pageStatus={pageStatus} setPageStatus={setPageStatus} />
      <Footer />
    </>
  );
}

export default App;
