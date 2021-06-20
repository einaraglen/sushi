import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useLocation, useHistory } from "react-router-dom";
//import { Context } from "context/State";
import Orders from "./Orders/Orders";
import Statistics from "./Statistics";
import About from "./About";
import "./HomeContent.css";

const useQuery = () => new URLSearchParams(useLocation().search);

const HomeContent = () => {
	const query = useQuery();
	//const state = React.useContext(Context);
	const history = useHistory();
	const secret = query.get("secret");
	const [currentTab, setCurrentTab] = React.useState(query.get("tab"));

	//workaround to using context inside useEffect without infinity loop
	//const effectState = React.useRef(state);
	const effectHistory = React.useRef(history);

	React.useEffect(() => {
		effectHistory.current.push(`/home?tab=${currentTab}&secret=${secret}`);
	}, [currentTab, secret]);

	const handleChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	return (
		<div>
			<div className="home-nav">
				<Tabs style={{width: "30rem", margin: "auto"}} value={currentTab} onChange={handleChange} indicatorColor="primary">
					<Tab label="Orders" value="orders" />
					<Tab label="Statistics" value="statistics" />
					<Tab label="About" value="about" />
				</Tabs>
			</div>
			{currentTab === "orders" ? (
				<Orders />
			) : currentTab === "statistics" ? (
				<Statistics />
			) : (
				<About />
			)}
		</div>
	);
};

export default HomeContent;
