import React from "react";
import { CircularProgress, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core/";
import FoodService from "services/FoodService";
import { Context } from "context/State";
import FoodRow from "./FoodRow";
import "./FoodManager.css";

const MakiTable = () => {
	const state = React.useContext(Context);
	const [food, setFood] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		//init guard
		let isMounted = true;
		//import service component
		let { findAll } = FoodService();
		const find = async () => {
			let res = await findAll();
			if (!isMounted) return;
			setFood(res.foods);
			//cancel loading, so site can render
			setIsLoading(false);
		};
		//call function crated in useEffect
		find();
		//clean up function for when component gets unmounted mid call
		return () => {
			isMounted = false;
		};
	}, [state]);

	return (
		<div>
			{isLoading ? (
				<div className="food-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
				<div className="food-table">
					<div className="food-table-nav">
						<FormControl variant="filled">
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
								<td>Pieces</td>
								<td>Image</td>
								<td>Type</td>
							</tr>
						</thead>
						<tbody>
							{food.map((current) => (
								<FoodRow key={current.number} food={current} />
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default MakiTable;
