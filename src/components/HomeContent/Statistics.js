import React from "react";
import UserService from "services/UserService";
import FoodService from "services/FoodService";
import OrderService from "services/OrderService";
import { Context } from "context/State";
import { CircularProgress } from "@material-ui/core/";
import { Bar, Line } from "react-chartjs-2";
import ImageService from "services/ImageService";

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

	const buildData = () => {
		let tempData = [];
		for (let i = 0; i < state.value.archives.length; i++) {
			let current = state.value.archives[i];
			for (let j = 0; j < current.food.length; j++) {
				let currentFood = state.value.foods.find((food) => food._id === current.food[j]);
				let foodIndex = tempData.findIndex((food) => food.name === currentFood.name);
				if (foodIndex > -1) {
					let tempArray = [...tempData];
					tempArray[foodIndex] = {
						...tempArray[foodIndex],
						value: tempArray[foodIndex].value + 1,
					};
					tempData = tempArray;
				}
				if (foodIndex === -1) {
					tempData.push({
						name: currentFood.name,
						fullname: `${currentFood.number} ${currentFood.name}`,
						value: 1,
					});
				}
			}
		}
		let sorted = [...tempData.sort((a, b) => (a.value > b.value ? -1 : 1))];
		let final = [];
		//get top 15 if sorted is bigger
		let limit = sorted.length > 15 ? 15 : sorted.length;
		for (let i = 0; i < limit; i++) {
			final[i] = sorted[i];
		}
		return final;
	};

	const buildOrdersPerDay = () => {
		let tempData = [];
		for (let i = 0; i < state.value.archives.length; i++) {
			let current = state.value.archives[i];
			let archiveIndex = tempData.findIndex(
				(archive) =>
					archive.date === new Date(current.created).toLocaleString().split(",")[0]
			);
			if (archiveIndex > -1) {
				let tempArray = [...tempData];
				tempArray[archiveIndex] = {
					...tempArray[archiveIndex],
					orders: tempArray[archiveIndex].orders + 1,
				};
				tempData = tempArray;
			}

			if (archiveIndex === -1) {
				tempData.push({
					date: new Date(current.created).toLocaleString().split(",")[0],
					orders: 1,
				});
			}
		}
		return [...tempData];
	};

	const test = async () => {
		let { findAllImages } = ImageService();
		let res = await findAllImages();
		console.log(res)
	}

	test();

	/*const handleInputChange = async (event) => {
		let { upload } = ImageService();
		let formData = new FormData();
		formData.append("image", event.target.files[0]);
		let res = await upload(formData)
		console.log(res)
	}*/

	return (
		<div className="stats">
			{isLoading ? (
				<div className="order-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
				<div className="statistics">
					{/*<input type="file" className="form-control" name="upload_file" onChange={handleInputChange} />*/}

					<div className="food-freq">
						<Bar
							style={{ height: "400px" }}
							data={{
								datasets: [
									{
										data: buildData(),
										backgroundColor: "hsl(128, 26%, 40%)", //y
										color: "#000",
										barPercentage: 1,
										categoryPercentage: 0.7,
									},
								],
							}}
							options={{
								scales: {
									x: {
										title: {
											display: true,
											text: "Volume",
										},
										ticks: {
											color: "hsl(0, 0%, 86%)",
										},
										grid: {
											color: "hsl(0, 0%, 12%)",
											drawBorder: false,
										},
									},
									y: {
										title: {
											display: true,
											text: "Food",
										},
										ticks: {
											color: "hsl(0, 0%, 86%)",
										},
										grid: {
											color: "hsl(0, 0%, 12%)",
											drawBorder: false,
										},
									},
								},
								indexAxis: "y",
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										display: false,
									},
								},
								parsing: {
									xAxisKey: "value",
									yAxisKey: "fullname",
								},
							}}
						/>
					</div>
					<div className="time-stats">
						<Line
							style={{ height: "400px" }}
							data={{
								datasets: [
									{
										data: buildOrdersPerDay(),
										borderColor: "hsl(128, 26%, 40%)", //y
										borderWidth: 2,
										radius: 0,
										tension: 0.1,
									},
								],
							}}
							options={{
								interaction: {
									intersect: false,
								},
								scales: {
									x: {
										title: {
											display: true,
											text: "Time",
										},
										ticks: {
											color: "hsl(0, 0%, 86%)",
										},
										grid: {
											color: "hsl(0, 0%, 12%)",
											drawBorder: false,
										},
									},
									y: {
										beginAtZero: true,
										type: 'linear',
        								grace: '5%',
										title: {
											display: true,
											text: "Orders",
										},
										ticks: {
											color: "hsl(0, 0%, 86%)",
										},
										grid: {
											color: "hsl(0, 0%, 12%)",
											drawBorder: false,
										},
									},
								},
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										display: false,
									},
								},
								parsing: {
									xAxisKey: "date",
									yAxisKey: "orders",
								},
							}}
						/>
					</div>
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
