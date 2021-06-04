import React from 'react';
import { useLocation } from 'react-router';
import { Link, useRouteMatch } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const Home = () => {

    const query = useQuery();
    const match = useRouteMatch();

    let page = 1;

    return (
        <div>
            <Link to={`${match.path}/?page=${page}`}>test</Link>
            <p>{query.get("page")}</p>
        </div>
    )
}

export default Home;