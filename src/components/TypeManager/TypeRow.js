import React from "react";
import { TextField, Button } from "@material-ui/core";
import { Context } from "context/State";
import TypeService from "services/TypeService";

const TypeRow = ({ type, add }) => {
	const state = React.useContext(Context);
	const [inEditMode, setInEditMode] = React.useState(add);
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

	const handleUpdate = async () => {
		setIsLoading(true);
        try {
            let { updateById } = TypeService();
            let res = await updateById(type._id, {
                name: formData.name,
                pieces: formData.pieces,
            });
            if (!res.status) return;
			state.setTypes(res.types);
            //switch out of edit mode
            handleEdit();
        } catch (error) {
            console.warn(error);
        }
        setIsLoading(false);
	}

	const handleAdd = () => {

	}

	//number of important columns
	let x = Object.keys(formData).length;
	return (
		<tr>
			<td>{add ? "To be generated" : type._id}</td>
			<td width={`${100 / x}%`}>
				{!inEditMode && !add ? (
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
			<td width={`${100 / x}%`}>
				{!inEditMode && !add ? (
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
					onClick={add ? handleAdd : handleEdit}
					color={inEditMode && !add ? "secondary" : "primary"}
					style={{ width: "5rem" }}
				>
					{add ? "Add" : inEditMode ? "Cancel" : "Edit"}
				</Button>
			</td>
			<td>
				{add ? null : (
					<Button
						disabled={isEdited || !inEditMode || isLoading}
						color="primary"
						onClick={handleUpdate}
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
