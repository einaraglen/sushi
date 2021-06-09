import React from "react";
import { TextField, Button } from "@material-ui/core";
import { Context } from "context/State";

const FoodRow = ({ food }) => {
	const state = React.useContext(Context);
	const [inEditMode, setInEditMode] = React.useState(false);
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
		if (
			formData.number === food.number &&
			formData.name === food.name &&
			formData.price === food.price &&
			formData.pieces === food.type.pieces &&
			formData.image === food.image &&
			formData.type === food.type.name
		) {
			return console.log("all is same")
		}

		console.log("changes found")
	}, [formData, food]);

	const handleFormChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	//number of importat columns
	let x = 6;

	return (
		<tr>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.number
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="number"
						variant="outlined"
						value={formData.number}
						style={{ width: "auto" }}
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.name
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="name"
						variant="outlined"
						value={formData.name}
						style={{ width: "auto" }}
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.price
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="price"
						variant="outlined"
						value={formData.price}
						style={{ width: "auto" }}
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.type.pieces
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="pieces"
						variant="outlined"
						value={formData.pieces}
						style={{ width: "auto" }}
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.image
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="image"
						variant="outlined"
						value={formData.image}
						style={{ width: "auto" }}
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode ? (
					food.type.name
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="type"
						variant="outlined"
						value={formData.type}
						style={{ width: "auto" }}
					/>
				)}
			</td>
			<td>
				<Button
					onClick={() => setInEditMode(!inEditMode)}
					color="primary"
					variant="outlined"
				>
					Edit
				</Button>
			</td>
			<td>
				<Button color="primary" variant="outlined">
					Update
				</Button>
			</td>
		</tr>
	);
};

export default FoodRow;
