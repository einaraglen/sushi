import React from "react";
import { CircularProgress, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core/";
import FoodService from "services/FoodService";
import TypeService from "services/TypeService";
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
		const find = async () => {
			let res_foods = await findAllFoods();
			let res_types = await findAllTypes()
			if (!isMounted) return;
			effectState.current.setFoods(res_foods.foods);
			effectState.current.setTypes(res_types.types);
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
						<FormControl variant="filled" size="small">
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
								<td>Price</td>
								<td>Image</td>
								<td>Type</td>
							</tr>
						</thead>
						<tbody>
						{false ? null : <FoodRow  food={{}} add />}
							{state.foods.map((current) => (
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
