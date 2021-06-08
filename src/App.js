import React from "react";
import "./App.css";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import Home from "components/Home/Home";
import Login from "components/Login/Login";
import { Context } from "context/State";
import UserService from "services/UserService";

const useQuery = () => new URLSearchParams(useLocation().search);

const App = () => {
    const state = React.useContext(Context);
    const query = useQuery();

    //Check cookie from browser on Render
    React.useEffect(() => {
        //init guard
        let isMounted = true;
        //import service component
        let { validateToken } = UserService();
        //create async function for getting data
        const validate = async () => {
            let res = await validateToken();
            if (res === undefined) return;
            //before we do anything with the async data, we check if our component is still mounted
            if (!isMounted) return;
            state.setValidUser(res.status);
        };
        //call function crated in useEffect
        validate();
        //clean up function for when component gets unmounted mid call
        return () => {
            isMounted = false;
        };
    }, [state]);

    return (
        <Switch>
            <Route path="/home">
                {!state.validUser ? (
                    <Redirect to={`/login?secret=${query.get("secret")}`} />
                ) : (
                    <Home />
                )}
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="*">
                <div>not found</div>
            </Route>
        </Switch>
    );
};

export default App;
