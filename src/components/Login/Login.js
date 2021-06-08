import React from "react";
import { useLocation } from "react-router";
//import { useRouteMatch } from "react-router-dom";
//import { Context } from 'context/State';

const useQuery = () => new URLSearchParams(useLocation().search);

const Login = () => {
    const query = useQuery();
    //const match = useRouteMatch();
    //const state = React.useContext(Context);

    return (
        <div>
            <p>{query.get("secret")}</p>
        </div>
    )
}

export default Login;