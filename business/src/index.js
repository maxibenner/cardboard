import React from "react";
import ReactDOM from "react-dom";
import "./globalStyles.css";
import App from "./App";
import { firebase } from './lib/firebase';
import { FirebaseContext } from './context/firebase';

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
