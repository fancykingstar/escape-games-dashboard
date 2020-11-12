import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { configureStore } from "redux/store";
import Routes from './Routes';

const history = createBrowserHistory();

const MainApp = () => (
  <Provider store={configureStore()}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>
);

export default MainApp;