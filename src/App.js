import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import EncryptedFileWorkflow from "./EncryptedFileWorkflow";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
            <EncryptedFileWorkflow />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
