import React from "react";
import "./Orders.css";
import OrderService from "services/OrderService";
import FoodService from "services/FoodService";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import AddModal from "./AddModal";
import { Context } from "context/State";

const Orders = () => {
	const state = React.useContext(Context);
	const [orders, setOrders] = React.useState([]);
	const [openModal, setOpenModal] = React.useState(false);

	//workaround to using context inside useEffect without infinity loop
	const effectState = React.useRef(state);
	const effectSetOrders = React.useRef(setOrders);

	//get all orders
	React.useEffect(() => {
		//init guard
		let isMounted = true;
		//import service component
		let { findAllOrders } = OrderService();
		let { findAllFoods } = FoodService();
		const find = async () => {
			let res_orders = await findAllOrders();
			let res_foods = await findAllFoods();
			if (!isMounted) return;
			effectSetOrders.current(res_orders);
			effectState.current.method.setFoods(res_foods.foods);
		};
		//call function crated in useEffect
		find();
		//clean up function for when component gets unmounted mid call
		return () => {
			isMounted = false;
		};
	}, []);

	const handleAddClick = () => {
		setOpenModal(true);
	};

	return (
		<div className="orders">
			<div className="order-content">
				<div className="orders-holder">
					<p>In-Progress</p>
				</div>
				<div className="orders-holder">
					<p>Done</p>
				</div>
			</div>
			<IconButton
				onClick={handleAddClick}
				style={{ position: "absolute", bottom: "90px", right: "90px" }}
				color="primary"
			>
				<AddCircleIcon style={{ fontSize: "3.5rem" }} />
			</IconButton>
			<AddModal openModal={openModal} setModalOpen={setOpenModal} />
		</div>
	);
};

export default Orders;
