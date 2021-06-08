import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import State from "context/State";

ReactDOM.render(
    <React.StrictMode>
        <State>
            <Router>
                <App />
            </Router>
        </State>
    </React.StrictMode>,
    document.getElementById("root")
);
