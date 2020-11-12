import React, { useEffect } from "react";
import NProgress from "nprogress";
import { Spinner } from "react-bootstrap";

function LoadingScreen() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div>
      <Spinner animation="grow" variant="dark" />
    </div>
  );
}

export default LoadingScreen;
