import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Game from "pages/Game";
import { configureStore } from "redux/store";

const MainApp = () => (
  <Provider store={configureStore()}>
    <Router>
      <Switch>
        <Route path="/" component={Game} />
      </Switch>
    </Router>
  </Provider>
);

export default MainApp;