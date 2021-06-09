import React from "react";
import {
    Link,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";
import { Context } from "context/State";
import MakiTable from "components/MakiTable/MakiTable";
import "./Home.css";

const useQuery = () => new URLSearchParams(useLocation().search);

const Home = () => {
    const query = useQuery();
    const state = React.useContext(Context);

    return (
        <div className="home">
            <div className="home-top-nav"></div>
            <div className="home-side-nav">
                <div className="home-links">
                    <Link to={`/home?secret=${query.get("secret")}`}>Home</Link>
                    <Link to={`/home/maki-table?secret=${query.get("secret")}`}>
                        Maki Table
                    </Link>
                    <Link
                        to={`/home/nigiri-table?secret=${query.get("secret")}`}
                    >
                        Nigiri Table
                    </Link>
                    <Link to={`/home/combo-table?secret=${query.get("secret")}`}>
                        Combo Table
                    </Link>
                </div>
            </div>
            <div className="home-content">
                <Switch>
                    <Route exact path="/home">
                        <div>HOME</div>
                    </Route>
                    <Route path={`/home/maki-table`}>
                        <MakiTable />
                    </Route>
                    <Route path={`/home/nigiri-table`}>
                        <div>NIGIRI</div>
                    </Route>
                    <Route path={`/home/combo-table`}>
                        <div>COMBO</div>
                    </Route>
                </Switch>
                <div className="home-footer">
                    Created by Einar Aglen - Version {state.version}
                </div>
            </div>
        </div>
    );
};

export default Home;
