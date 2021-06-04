import React from "react";
import { useLocation } from "react-router";
import { Link, useRouteMatch } from "react-router-dom";
import { Context } from 'context/State';

const useQuery = () => new URLSearchParams(useLocation().search);

const Home = () => {
    const query = useQuery();
    const match = useRouteMatch();
    const state = React.useContext(Context);

    return (
        <div>
            <Link to={`${match.path}?page=2`}>test</Link>
            <p>{query.get("page")}</p>
        </div>
    );
};

export default Home;
