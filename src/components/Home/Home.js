import React from "react";
import { useLocation } from "react-router";
import { Context } from "context/State";
import "./Home.css";

const useQuery = () => new URLSearchParams(useLocation().search);

const Home = () => {
	const query = useQuery();
	const state = React.useContext(Context);

	return (
		<div className="home">
			<div className="home-top-nav"></div>
			<div className="home-side-nav">cunst</div>
			<div className="home-content">
                suip
				<div className="home-footer">Created by Einar Aglen - Version {state.version}</div>
			</div>
		</div>
	);
};

export default Home;
