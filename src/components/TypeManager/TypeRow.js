import React from "react";
import { TextField, Button } from "@material-ui/core";
import { Context } from "context/State";

const TypeRow = ({ type, action }) => {
	const state = React.useContext(Context);
	const [inEditMode, setInEditMode] = React.useState(action === "add");
	const [isEdited, setIsEdited] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [formData, setFormData] = React.useState({
		name: "",
		pieces: 0,
	});

	//check to see if formData !== food object, to schedule available update
	React.useEffect(() => {
		setIsEdited(formData.name === type.name && formData.pieces === type.pieces);
	}, [formData, type]);

	const canEdit = () => {
		return !state.isEditing || inEditMode;
	};

	const handleEdit = () => {
		if (!inEditMode) {
			//if cancel, reset formData
			setFormData({
				name: type.name,
				pieces: type.pieces,
			});
		}
		state.setIsEditing(!inEditMode);
		setInEditMode(!inEditMode);
	};

	const handleFormChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleAdd = () => {

	}

	return (
		<tr>
			<td>{action === "add" ? "To be generated" : type._id}</td>
			<td>
				{!inEditMode && action !== "add" ? (
					type.name
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="name"
						variant="filled"
						value={formData.name}
						size="small"
						type="text"
					/>
				)}
			</td>
			<td>
				{!inEditMode && action !== "add" ? (
					type.pieces
				) : (
					<TextField
						onChange={(event) => handleFormChange(event)}
						name="pieces"
						variant="filled"
						value={formData.pieces}
						size="small"
						type="number"
					/>
				)}
			</td>
			<td>
				<Button
					disabled={!canEdit() || isLoading}
					onClick={action === "add" ? handleAdd : handleEdit}
					color={inEditMode && action !== "add" ? "secondary" : "primary"}
					style={{ width: "5rem" }}
				>
					{action === "add" ? "Add" : inEditMode ? "Cancel" : "Edit"}
				</Button>
			</td>
			<td>
				{action === "add" ? null : (
					<Button
						disabled={isEdited || !inEditMode || isLoading}
						color="primary"
						variant="contained"
						style={{ marginRight: "1rem" }}
					>
						Update
					</Button>
				)}
			</td>
		</tr>
	);
};

export default TypeRow;
