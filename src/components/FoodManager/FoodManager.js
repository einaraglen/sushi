import React from "react";
import { CircularProgress, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core/";
import FoodService from "services/FoodService";
import TypeService from "services/TypeService";
import ContentService from "services/ContentService";
import { Context } from "context/State";
import FoodRow from "./FoodRow";
import "./FoodManager.css";

const FoodManager = () => {
	const state = React.useContext(Context);
	const [isLoading, setIsLoading] = React.useState(true);

	//workaround to using context inside useEffect without infinity loop
	const effectState = React.useRef(state);

	React.useEffect(() => {
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

	return (
		<div>
			{isLoading ? (
				<div className="food-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
				<div className="food-table">
					<div className="food-table-nav">
						<FormControl style={{width: "100%"}} variant="filled" size="small">
							<InputLabel>Sort By</InputLabel>
							<Select label="Generation" value={0}>
								<MenuItem value={0}>
									<em>Number</em>
								</MenuItem>
							</Select>
						</FormControl>
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
						{false ? null : <FoodRow  food={{}} add />}
							{state.value.foods.sort((a, b) => a.number > b.number ? 1 : -1).map((current) => (
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
