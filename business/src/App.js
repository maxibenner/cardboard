import React from "react";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
