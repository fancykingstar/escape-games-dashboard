import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./style/variable.scss";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import App from "./App";
import * as reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <App />,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals.unregister();
