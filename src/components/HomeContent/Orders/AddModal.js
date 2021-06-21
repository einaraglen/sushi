import React from "react";
import Modal from "react-modal";
import { Context } from "context/State";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import OrderService from "services/OrderService";
import ResponseHandler from "utils/ResponseHandler";

const FoodItem = ({ food, pickFood, picked }) => {
	const handleAdd = () => {
		pickFood("add", food._id);
	};

	const handleRemove = () => {
		pickFood("remove", food._id);
	};

	return (
		<div className="food-item">
			<p>{`${food.number} ${food.name}`}</p>
			{!picked ? (
				<IconButton onClick={handleAdd} color="primary" variant="contained">
					<AddCircleIcon />
				</IconButton>
			) : (
				<IconButton onClick={handleRemove} color="secondary" variant="contained">
					<CancelIcon />
				</IconButton>
			)}
		</div>
	);
};

const AddModal = ({ openModal, setOpenModal }) => {
	const state = React.useContext(Context);
	const [pickedFoods, setPickedFoods] = React.useState({});
	const [currentSearch, setCurrentSearch] = React.useState("");
	const { handleResponse } = ResponseHandler();

	React.useEffect(() => {
		document.body.style.overflow = openModal ? 'hidden' : 'unset';
		document.body.style.paddingRight = openModal ? '17px' : '0px';
	}, [openModal])

	const pickFood = (action, id) => {
		if (action === "remove") return removePicked(id);
		let instances = pickedFoods[id] ? pickedFoods[id] : 0;
		let newCount = action === "add" ? instances + 1 : instances - 1;
		if (newCount <= 0) return removePicked(id);
		new setPickedFoods({
			...pickedFoods,
			[id]: newCount,
		});
	};

	const removePicked = (id) => {
		let temp = { ...pickedFoods };
		delete temp[id];
		setPickedFoods(temp);
	};

	const addOrder = async () => {
		try {
			let { add } = OrderService();
			let res = await add({
				food: buildFoodList(),
				price: getTotalPrice(),
			});
			handleResponse(res, "orders", state.method.setOrders);
            if (!res.status) return;
            close();
		} catch (error) {
			console.warn(error);
		}
	};

	//for another time
	/*const handleScroll = () => {
        document.getElementById("bottom").scrollIntoView(false);
    }*/

	const buildFoodList = () => {
		let temp = [];
		Object.entries(pickedFoods).forEach((item) => {
			for (let i = 0; i < item[1]; i++) {
				temp.push(item[0]);
			}
		});
		return temp;
	};

	const handleSearch = (event) => {
		setCurrentSearch(event.target.value);
	};

	const handleData = () => {
		if (currentSearch !== "")
			return state.value.foods.filter(
				(food) => `${food.number}${food.name}`.toLowerCase().indexOf(currentSearch) > -1
			);
		return state.value.foods;
	};

	const getFoodItemOf = (id) => {
		return state.value.foods.filter((food) => food._id === id)[0];
	};

	const getTotalPrice = () => {
		let total = 0;
		Object.entries(pickedFoods).forEach(
			(item) => (total += getFoodItemOf(item[0]).price * item[1])
		);
		return total;
	};

	const close = () => {
		setPickedFoods({})
		setOpenModal(false);
	};

	return (
		<Modal
			isOpen={openModal}
			shouldCloseOnOverlayClick={false}
			ariaHideApp={false}
			style={{
				content: {
					display: "flex",
					flexDirection: "column",
					width: "50rem",
					height: "45rem",
					margin: "auto",
					backgroundColor: "hsl(0, 0%, 25%)",
					border: "none",
				},
				overlay: {
					overscrollBehavior: "contain",
					//workaround: modal was not covering header
					zIndex: 8,
					backgroundColor: "rgba(0, 0, 0, 0.2)",
				},
			}}
		>
			<div className="add-content">
				<TextField
					onChange={handleSearch}
					style={{
						width: "14rem",
						marginLeft: "auto",
						marginRight: "auto",
						marginBottom: ".7rem",
					}}
					label="Search"
					variant="filled"
					size="small"
					type="text"
				/>
				<div className="food-picker">
					{handleData().map((food) => (
						<FoodItem
                            key={food._id}
							food={food}
							pickFood={pickFood}
							picked={pickedFoods.hasOwnProperty(food._id)}
						/>
					))}
				</div>
				<div className="picked">
					<table>
						<thead>
							<tr>
								<td>Number</td>
								<td>Name</td>
								<td>Quantity</td>
								<td>Price</td>
							</tr>
						</thead>
						<tbody>
							{Object.entries(pickedFoods).map((item) => (
								<tr key={item[0]}>
									<td>{getFoodItemOf(item[0]).number}</td>
									<td>{getFoodItemOf(item[0]).name}</td>
									<td>
										<div>
											<IconButton
												onClick={() => pickFood("decrement", item[0])}
												color="secondary"
												variant="contained"
											>
												<RemoveCircleIcon />
											</IconButton>
											{item[1]}
											<IconButton
												onClick={() => pickFood("add", item[0])}
												color="primary"
												variant="contained"
											>
												<AddCircleIcon />
											</IconButton>
										</div>
									</td>
									<td>{getFoodItemOf(item[0]).price * item[1]}</td>
								</tr>
							))}
							<tr>
								<td></td>
								<td></td>
								<td></td>
								<th id="bottom">{getTotalPrice()}</th>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="controlls">
					<Button
						onClick={close}
						style={{ width: "7rem", margin: "auto" }}
						color="default"
						variant="contained"
					>
						Cancel
					</Button>
					<Button
						onClick={addOrder}
						style={{ width: "7rem", margin: "auto" }}
						color="primary"
						variant="contained"
					>
						Add
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default AddModal;
