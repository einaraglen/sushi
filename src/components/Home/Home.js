import React from "react";
import {
    Link,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";
import { Context } from "context/State";
import FoodManager from "components/FoodManager/FoodManager";
import "./Home.css";

document.title = "Home | Sushi"

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
                    <Link to={`/home/manage-food?secret=${query.get("secret")}`}>
                        Manage Food
                    </Link>
                </div>
            </div>
            <div className="home-content">
                <Switch>
                    <Route exact path="/home">
                        <div>HOME</div>
                    </Route>
                    <Route path={`/home/manage-food`}>
                        <FoodManager />
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
