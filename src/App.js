import React from "react";
import "./App.css";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";
import Home from "components/Home/Home";
import State from "context/State";

const App = () => {
    return (
        <State.Provider>
            <Router>
                <Switch>
                    <Route path="/home">
                        <Home />
                    </Route>

                    <Route exact path="/">
                        <Redirect to="/home" />
                    </Route>

                    <Route path="*">
                        <div>not found</div>
                    </Route>
                </Switch>
            </Router>
        </State.Provider>
    );
};

export default App;
