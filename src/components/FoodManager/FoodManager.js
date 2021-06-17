import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core/";
import { TextField, Button } from "@material-ui/core";
import FoodService from "services/FoodService";
import TypeService from "services/TypeService";
import ContentService from "services/ContentService";
import { Context } from "context/State";
import FoodRow from "./FoodRow";
import "./FoodManager.css";
import { MenuItem, FormControl, Select } from "@material-ui/core/";
import InputLabel from "@material-ui/core/InputLabel";

const useQuery = () => new URLSearchParams(useLocation().search);

const FoodManager = () => {
	const query = useQuery();
	const state = React.useContext(Context);
	const history = useHistory();
	const secret = query.get("secret");
	const [isLoading, setIsLoading] = React.useState(true);
	const [currentSort, setCurrentSort] = React.useState(query.get("sort"));
	const [currentSearch, setCurrentSearch] = React.useState(query.get("search"));
	const [addOpen, setAddOpen] = React.useState(false);

	//workaround to using context inside useEffect without infinity loop
	const effectState = React.useRef(state);
	const effectHistory = React.useRef(history);

	React.useEffect(() => {
		console.log("re render food");
		//resets global edit for when manager is init
		effectState.current.method.setIsEditing(false);
		//init guard
		let isMounted = true;
		//import service component
		let { findAllFoods } = FoodService();
		let { findAllTypes } = TypeService();
		let { findAllContents } = ContentService();
		const find = async () => {
			let res_foods = await findAllFoods();
			let res_types = await findAllTypes();
			let res_contents = await findAllContents();
			if (!isMounted) return;
			effectState.current.method.setFoods(res_foods.foods);
			effectState.current.method.setTypes(res_types.types);
			effectState.current.method.setContents(res_contents.contents);
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
			`/home/manage-food?search=${currentSearch}&sort=${currentSort}&secret=${secret}`
		);
	}, [currentSort, currentSearch, secret]);

	const handleData = () => {
		//init temp data
		let handled = [...state.value.foods];
		//filter if search has been choosen
		if (query.get("search") !== "null")
			handled = handled.filter(
				(food) => food.name.toLowerCase().indexOf(query.get("search")) > -1
			);
		//sort if sort has been choosen
		if (query.get("sort") !== "null")
			handled = handled.sort((a, b) =>
				a[query.get("sort")] > b[query.get("sort")] ? 1 : -1
			);

		return handled;
	};

	const handleFormChange = (event) => {
		setCurrentSort(event.target.value !== "null" ? event.target.value : "number");
	};

	return (
		<div>
			{isLoading ? (
				<div className="food-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
				<div className="food-table">
					<div className="food-table-nav">
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
								<MenuItem value={"number"}>Number</MenuItem>
								<MenuItem value={"name"}>Name</MenuItem>
								<MenuItem value={"price"}>Price</MenuItem>
							</Select>
						</FormControl>
						<Button
							onClick={() => setAddOpen(!addOpen)}
							style={{ gridArea: "button", width: "7rem", margin: "auto" }}
							color="primary"
							variant="contained"
						>
							Add
						</Button>
					</div>
					<table>
						<thead>
							<tr>
								<td>Number</td>
								<td>Name</td>
								<td>Contents</td>
								<td>Price</td>
								<td>Image</td>
								<td>Type</td>
							</tr>
						</thead>
						<tbody>
							{!addOpen ? null : <FoodRow food={{}} add />}
							{handleData().map((current) => (
								<FoodRow key={current._id} food={current} />
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default FoodManager;
