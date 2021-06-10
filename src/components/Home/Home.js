import React from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { Context } from "context/State";
import FoodManager from "components/FoodManager/FoodManager";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./Home.css";

document.title = "Home | Sushi";

const useQuery = () => new URLSearchParams(useLocation().search);

const Home = () => {
	const query = useQuery();
	const state = React.useContext(Context);

	return (
		<div className="home">
			<div className="home-top-nav"></div>
			<div className="home-side-nav">
				<List component="nav">
					<Link to={`/home?secret=${query.get("secret")}`}>
						<ListItem button>
							<ListItemText primary="Home" />
						</ListItem>
					</Link>
					<Link to={`/home/manage-food?secret=${query.get("secret")}`}>
						<ListItem button>
							<ListItemText primary="Manage Food" />
						</ListItem>
					</Link>
				</List>
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
				<div className="home-footer">Created by Einar Aglen - Version {state.version}</div>
			</div>
		</div>
	);
};

export default Home;
