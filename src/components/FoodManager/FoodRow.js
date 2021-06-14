import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";
import FoodService from "services/FoodService";
import { MenuItem, FormControl, Menu, Select } from "@material-ui/core/";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const FoodRow = ({ food, add }) => {
	const state = React.useContext(Context);
	const [inEditMode, setInEditMode] = React.useState(add);
	const [isEdited, setIsEdited] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [formData, setFormData] = React.useState({
		number: "",
		name: "",
		content: "",
		price: "",
		image: "",
		type: "",
	});

	//check to see if formData !== food object, to schedule available update
	React.useEffect(() => {
		setIsEdited(
			formData.number === food.number &&
				formData.name === food.name &&
				formData.content === food.content &&
				formData.price === food.price &&
				formData.image === food.image &&
				formData.type === food.type
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
				content: food.content,
				price: food.price,
				image: food.image,
				type: food.type,
			});
		}
		state.method.setIsEditing(!inEditMode);
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
				content: formData.content,
				price: formData.price,
				image: formData.image,
				type: formData.type,
			});
			if (!res.status) return;
			state.method.setFoods(res.foods);
			//switch out of edit mode
			handleEdit();
		} catch (error) {
			console.warn(error);
		}
		setIsLoading(false);
	};

	const handleAdd = async () => {
		setIsLoading(true);
		try {
			let { addFood } = FoodService();
			let res = await addFood(formData);
			if (!res.status) return;
			state.method.setFoods(res.foods);
		} catch (error) {
			console.warn(error);
		}
		setIsLoading(false);
	};

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			let { deleteFood } = FoodService();
			let res = await deleteFood(food._id);
			if (!res.status) return;
			state.method.setFoods(res.foods);
			handleEdit();
		} catch (error) {
			console.warn(error);
		}
		setIsLoading(false);
	};

	const formatType = () => {
		let type = state.value.types.find((type) => type._id === food.type);
		if (!type) return "Type Missing";
		return `${type.name} (${type.pieces} each)`;
	};

	const handleClickListItem = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	//number of important columns
	let x = Object.keys(formData).length + 1;
	return (
		<tr>
			<td width={`${100 / x}%`}>
				{!inEditMode && !add ? (
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
				{!inEditMode && !add ? (
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
				{!inEditMode && !add ? (
					food.content.toString()
				) : (
					<div>
						<p onClick={handleClickListItem}>Content</p>
						<Menu
							onClose={handleClose}
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							getContentAnchorEl={null}
							anchorOrigin={{ vertical: "top", horizontal: "center" }}
							transformOrigin={{ vertical: "top", horizontal: "center" }}
						>
							<FormControl>
								<RadioGroup name="content" value={0} onChange={(event) => console.log(event.target)}>
									{state.value.contents.map((content) => (
										<FormControlLabel
										style={{padding: ".3rem"}}
											value={content._id}
											control={<Radio style={{marginLeft: "1rem"}} color="primary"/>}
											label={content.name}
										/>
									))}
								</RadioGroup>
							</FormControl>
						</Menu>
					</div>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode && !add ? (
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
				{!inEditMode && !add ? (
					<a href={food.image} target="_blank" rel="noreferrer">
						Image
					</a>
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
				{!inEditMode && !add ? (
					formatType()
				) : (
					<FormControl
						style={{ width: "100%" }}
						size="small"
						variant="filled"
						elevation={1}
					>
						<Select
							onChange={(event) => handleFormChange(event)}
							name="type"
							value={formData.type}
						>
							{state.value.types.map((type) => (
								<MenuItem
									key={type._id}
									value={type._id}
								>{`${type.name} (${type.pieces} each)`}</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</td>
			<td>
				<IconButton
					disabled={!canEdit() || isLoading}
					onClick={add ? handleAdd : handleEdit}
					color={inEditMode && !add ? "secondary" : "primary"}
					variant="text"
				>
					{add ? <AddCircleIcon /> : inEditMode ? <CancelIcon /> : <EditIcon />}
				</IconButton>
			</td>
			<td>
				{add ? null : (
					<IconButton
						disabled={isEdited || !inEditMode || isLoading}
						onClick={handleUpdate}
						color="primary"
						variant="contained"
					>
						<CheckCircleIcon />
					</IconButton>
				)}
			</td>
			<td>
				{add ? null : (
					<IconButton
						disabled={!inEditMode || isLoading}
						onClick={handleDelete}
						color="secondary"
						variant="contained"
					>
						<DeleteIcon />
					</IconButton>
				)}
			</td>
		</tr>
	);
};

export default FoodRow;
