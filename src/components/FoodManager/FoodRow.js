import React from "react";
import { TextField, Button } from "@material-ui/core";
import { Context } from "context/State";
import FoodService from "services/FoodService";

const FoodRow = ({ food }) => {
	const state = React.useContext(Context);
	const [inEditMode, setInEditMode] = React.useState(false);
	const [isEdited, setIsEdited] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [formData, setFormData] = React.useState({
		number: food.number,
		name: food.name,
		price: food.price,
		pieces: food.type.pieces,
		image: food.image,
		type: food.type.name,
	});

	//check to see if formData !== food object, to schedule available update
	React.useEffect(() => {
		setIsEdited(
			formData.number === food.number &&
				formData.name === food.name &&
				formData.price === food.price &&
				formData.pieces === food.type.pieces &&
				formData.image === food.image &&
				formData.type === food.type.name
		);
	}, [formData, food]);

	const handleFormChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleEdit = () => {
		if (!inEditMode) {
			//if cancel, reset formData
			setFormData({
				number: food.number,
				name: food.name,
				price: food.price,
				pieces: food.type.pieces,
				image: food.image,
				type: food.type.name,
			});
		}
		state.setIsEditing(!inEditMode);
		setInEditMode(!inEditMode);
	};

	const canEdit = () => {
		return !state.isEditing || inEditMode;
	};

	const handleUpdate = async () => {
		setIsLoading(true);
		try {
			let { updateById } = FoodService();
			let res = await updateById(food._id, {
				number: formData.number,
				name: formData.name,
				price: formData.price,
				image: formData.image,
				type: {
					name: formData.type,
					pieces: formData.pieces,
				},
			});
			if (!res.status) return;
			//switch out of edit mode
			handleEdit();
		} catch (error) {
			console.warn(error);
		}
		setIsLoading(false);
	};

	//number of important columns
	let x = Object.keys(formData).length;

	return (
		<tr>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.number
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormChange(event)}
						name="number"
						variant="filled"
						value={formData.number}
						size="small"
						type="number"
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.name
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormChange(event)}
						name="name"
						variant="filled"
						value={formData.name}
						size="small"
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.price
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormChange(event)}
						name="price"
						variant="filled"
						value={formData.price}
						size="small"
						type="number"
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.type.pieces
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormChange(event)}
						name="pieces"
						variant="filled"
						value={formData.pieces}
						size="small"
						type="number"
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					<a href={food.image} target="_blank">Image</a>
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormChange(event)}
						name="image"
						variant="filled"
						value={formData.image}
						size="small"
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.type.name
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormChange(event)}
						name="type"
						variant="filled"
						value={formData.type}
						size="small"
					/>
				)}
			</td>
			<td>
				<Button
					disabled={!canEdit() || isLoading}
					onClick={handleEdit}
					color={inEditMode ? "secondary" : "primary"}
					variant="text"
					style={{ width: "5rem" }}
				>
					{inEditMode ? "Cancel" : "Edit"}
				</Button>
			</td>
			<td>
				<Button disabled={isEdited || !inEditMode || isLoading} onClick={handleUpdate} color="primary" variant="contained">
					Update
				</Button>
			</td>
		</tr>
	);
};

export default FoodRow;
