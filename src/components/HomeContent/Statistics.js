import React from "react";
import UserService from "services/UserService";
import FoodService from "services/FoodService";
import OrderService from "services/OrderService";
import { Context } from "context/State";
import { CircularProgress } from "@material-ui/core/";

const Statistics = () => {
	const state = React.useContext(Context);
	const [isLoading, setIsLoading] = React.useState(true);

	//workaround to using context inside useEffect without infinity loop
	const effectState = React.useRef(state);

	//get all orders
	React.useEffect(() => {
		//init guard
		let isMounted = true;
		//import service component
		let { findAllArchives } = OrderService();
		let { findAllFoods } = FoodService();
		let { refreshToken, logout } = UserService();
		const find = async () => {
			//these we will display on screen, will not work unless token i active so refresh is needed
			let res_archives = await findAllArchives();
			if (!res_archives.status) {
				let refresh_res = await refreshToken();
				effectState.current.method.setValidUser(refresh_res.status);
				if (!refresh_res.status) return await logout();
				res_archives = await findAllArchives();
			}
			//for manual add of order
			let res_foods = await findAllFoods();
			if (!isMounted) return;
			effectState.current.method.setArchives(res_archives.archives);
			effectState.current.method.setFoods(res_foods.foods);
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

    const formatFood = (foods) => {
		let foodString = "";
		if (foods.length === 0) return "No Food Found";
		for (let i = 0; i < foods.length; i++) {
			let current = state.value.foods.find((food) => food._id === foods[i]);
			if (!current) return;
			if (i === foods.length - 1) return (foodString += current.number);
			foodString += `${current.number}, `;
		}
		return foodString;
	};
    
	return (
		<div className="stats">
			{isLoading ? (
				<div className="order-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
				<div>
					<div className="archives">
						<table>
							<thead>
								<tr>
									<td>Created</td>
									<td>Closed</td>
									<td>ID</td>
									<td>Food</td>
									<td>Price</td>
								</tr>
							</thead>
							<tbody>
								{state.value.archives.map((archive) => (
									<tr key={archive.shortid}>
										<td>{new Date(archive.created).toLocaleString()}</td>
										<td>{new Date(archive.closed).toLocaleString()}</td>
										<td>{archive.shortid}</td>
										<td>{formatFood(archive.food)}</td>
										<td>{archive.price} kr</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default Statistics;
