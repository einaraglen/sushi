import React from "react";
import { Context } from "context/State";
import ContentService from "services/ContentService";
import { CircularProgress } from "@material-ui/core/";
import ContentRow from "./ContentRow";
import "./ContentManager.css";
import { MenuItem, FormControl, Select } from "@material-ui/core/";
import InputLabel from "@material-ui/core/InputLabel";
import { useLocation, useHistory } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";

const useQuery = () => new URLSearchParams(useLocation().search);

const ContentManager = () => {
	const query = useQuery();
	const state = React.useContext(Context);
	const history = useHistory();
	const secret = query.get("secret");
	const [isLoading, setIsLoading] = React.useState(true);
	const [currentSort, setCurrentSort] = React.useState(query.get("sort"));
	const [currentSearch, setCurrentSearch] = React.useState(query.get("search"));

	//workaround to using context inside useEffect without infinity loop
	const effectState = React.useRef(state);
	const effectHistory = React.useRef(history);

	React.useEffect(() => {
		//resets global edit for when manager is init
		effectState.current.method.setIsEditing(false);
		effectState.current.method.setAddOpen(false);
		//init guard
		let isMounted = true;
		//import service component
		let { findAllContents } = ContentService();
		const find = async () => {
			let res = await findAllContents();
			if (!isMounted) return;
			effectState.current.method.setContents(res.contents);
			//cancel loading, so site can render
			setIsLoading(false);
		};
		//call function crated in useEffect
		find();
		//clean up function for when component gets unmounted mid call
		return () => {
			isMounted = false;
		};
	}, []);

	//listen to any change in variables and change path
	React.useEffect(() => {
		effectHistory.current.push(
			`/home/manage-content?search=${currentSearch}&sort=${currentSort}`
		);
	}, [currentSort, currentSearch, secret]);

	const handleData = () => {
		//init temp data
		let handled = [...state.value.contents];
		//filter if search has been choosen
		if (query.get("search") !== "null")
			handled = handled.filter(
				(type) => type.name.toLowerCase().indexOf(query.get("search")) > -1
			);
		//sort if sort has been choosen
		if (query.get("sort") !== "null")
			handled = handled.sort((a, b) =>
				a[query.get("sort")] > b[query.get("sort")] ? 1 : -1
			);

		return handled;
	};

	const handleFormChange = (event) => {
		setCurrentSort(event.target.value !== "null" ? event.target.value : "_id");
	};

	return (
		<div>
			{isLoading ? (
				<div className="content-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
				<div className="content">
					<div className="content-nav">
						<TextField
							onChange={(event) =>
								setCurrentSearch(
									event.target.value.length > 0
										? event.target.value.toLowerCase()
										: "null"
								)
							}
							style={{ gridArea: "search" }}
							label="Search"
							variant="filled"
							size="small"
							type="text"
						/>
						<FormControl
							style={{ gridArea: "sort" }}
							size="small"
							variant="filled"
							elevation={1}
							label="Search"
						>
							<InputLabel>Sort by</InputLabel>
							<Select
								onChange={(event) => handleFormChange(event)}
								value={currentSort}
								label="Search"
							>
								<MenuItem value={"_id"}>ID</MenuItem>
								<MenuItem value={"name"}>Name</MenuItem>
							</Select>
						</FormControl>
						<Button
							onClick={() => state.method.setAddOpen(!state.value.addOpen)}
							style={{ gridArea: "button", width: "7rem", margin: "auto" }}
							color="primary"
							variant="contained"
						>
							{!state.value.addOpen ? "Add" : "Close"}
						</Button>
					</div>
					<table>
						<thead>
							<tr>
								<td>ID</td>
								<td>Name</td>
								<td></td>
                                <td></td>
                                <td></td>
							</tr>
						</thead>
						<tbody>
							{!state.value.addOpen ? null : <ContentRow content={{}} add />}
							{handleData().map((content) => (
								<ContentRow key={content._id} content={content} />
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default ContentManager;
