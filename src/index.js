import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import State from "context/State";

ReactDOM.render(
        <State>
            <Router>
                <App />
            </Router>
        </State>,
    document.getElementById("root")
);
