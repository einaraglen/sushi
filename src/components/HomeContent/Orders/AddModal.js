import React from "react";
import Modal from "react-modal";
import { Context } from "context/State";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";

const FoodItem = ({ food, pickFood }) => {
	const handleFoodClick = () => {
		pickFood(food._id);
	};

	return (
		<div onClick={handleFoodClick} className="food-item">
			<p>{food.number}</p>
			<p>{food.name}</p>
		</div>
	);
};

const AddModal = ({ openModal, setOpenModal }) => {
	const state = React.useContext(Context);
	const [pickedFoods, setPickedFoods] = React.useState({});
	const [currentSearch, setCurrentSearch] = React.useState("");

	const pickFood = (id) => {
		let instances = pickedFoods[id] ? pickedFoods[id] : 0;
		setPickedFoods({
			...pickedFoods,
			[id]: instances + 1,
		});
	};

	const handleSearch = (event) => {
		setCurrentSearch(event.target.value);
	};

	const close = () => {
		setOpenModal(false);
	};

	const handleData = () => {
		if (currentSearch !== "")
			return state.value.foods.filter(
				(food) => food.name.toLowerCase().indexOf(currentSearch) > -1
			);
		return state.value.foods;
	};

    const getFoodItemOf = (id) => {
        return state.value.foods.filter((food) => food._id === id)[0];
    }

    const getTotalPrice = () => {
        let total = 0;
        Object.entries(pickedFoods).forEach((item) => total += getFoodItemOf(item[0]).price);
        return total
    }

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
					zIndex: 10,
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
						<FoodItem food={food} pickFood={pickFood} />
					))}
				</div>
				<table>
					<thead>
						<tr>
							<td>Number</td>
							<td>Name</td>
							<td>Quantity</td>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(pickedFoods).map((item) => 
                            <tr>
                                <td>{getFoodItemOf(item[0]).number}</td>
                                <td>{getFoodItemOf(item[0]).name}</td>
                                <td>{item[1]}</td>
                                <td>{getFoodItemOf(item[0]).price * item[1]}</td>
                            </tr>
                        )}
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<th>{getTotalPrice()}</th>
						</tr>
					</tbody>
				</table>
			</div>
		</Modal>
	);
};

export default AddModal;
