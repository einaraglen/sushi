import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";
import { MenuItem, FormControl, Select } from "@material-ui/core/";
import ContentPicker from "./ContentPicker";
import RowControlls from "components/RowControlls/RowControlls";

const FoodRow = ({ food, add }) => {
	const state = React.useContext(Context);
	const [inEditMode, setInEditMode] = React.useState(add);
	const [isEdited, setIsEdited] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	//fix for issue #1
	const [pickedContent, setPickedContent] = React.useState(food.content ? food.content : []);
	const [formData, setFormData] = React.useState({
		number: "",
		name: "",
		content: pickedContent,
		price: "",
		image: "",
		type: "",
	});

	const foodRef = React.useRef(food);

	//check to see if formData !== food object, to schedule available update
	React.useEffect(() => {
		setIsEdited(
			formData.number === foodRef.current.number &&
				formData.name === foodRef.current.name &&
				//compare arrays!
				JSON.stringify(formData.content) === JSON.stringify(foodRef.current.content) &&
				formData.price === foodRef.current.price &&
				formData.image === foodRef.current.image &&
				formData.type === foodRef.current.type
		);
	}, [formData]);

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

	const formatType = () => {
		let type = state.value.types.find((type) => type._id === food.type);
		if (!type) return "Type Missing";
		return `${type.name} (${type.pieces} each)`;
	};

	const formatContent = () => {
		let contentString = "";
		if (!pickedContent || setPickedContent.length === 0) return "No Content Found";
		for (let i = 0; i < pickedContent.length; i++) {
			let current = state.value.contents.find((content) => content._id === pickedContent[i]);
			if (!current) return;
			if (i === pickedContent.length - 1) return (contentString += current.name);
			contentString += `${current.name}, `;
		}
		return contentString;
	};

	const handleFormEvent = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleContentPick = (event) => {
		setPickedContent(event.target.value);
	}

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
						onChange={(event) => handleFormEvent(event)}
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
						onChange={(event) => handleFormEvent(event)}
						name="name"
						variant="filled"
						value={formData.name}
						size="small"
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode && !add ? (
					formatContent()
				) : (
					<ContentPicker
						content={pickedContent}
						onChange={(event) => handleContentPick(event)}
					/>
				)}
			</td>
			<td width={`${100 / x}%`}>
				{!inEditMode && !add ? (
					food.price
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormEvent(event)}
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
						<img
							alt={"Sushi piece"}
							src={food.image}
							style={{ borderRadius: "50%", height: "4rem" }}
						/>
					</a>
				) : (
					<TextField
						disabled={isLoading}
						onChange={(event) => handleFormEvent(event)}
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
							onChange={(event) => handleFormEvent(event)}
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
			<RowControlls
				currentObject={food}
				type="foods"
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				formData={{
					...formData,
					content: pickedContent, 
				}}
				setFormData={setFormData}
				inEditMode={inEditMode}
				handleEdit={handleEdit}
				canEdit={canEdit}
				isEdited={isEdited}
				add={add}
			/>
		</tr>
	);
};

export default FoodRow;
