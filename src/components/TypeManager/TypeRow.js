import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";
import RowControlls from "components/RowControlls/RowControlls";

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
		return !state.value.isEditing || inEditMode;
	};

	const handleEdit = () => {
		if (!inEditMode) {
			//if cancel, reset formData
			setFormData({
				name: type.name,
				pieces: type.pieces,
			});
		}
		state.method.setIsEditing(!inEditMode);
		setInEditMode(!inEditMode);
	};

	const handleFormChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	//number of important columns
	let x = Object.keys(formData).length + 2;
	return (
		<tr>
			<td width={`${100 / x}%`}>{add ? "To be generated" : type._id}</td>
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
			<RowControlls
                currentObject={type}
                type="types"
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                formData={formData}
                inEditMode={inEditMode}
                handleEdit={handleEdit}
				canEdit={canEdit}
				isEdited={isEdited}
                add={add}
            />
		</tr>
	);
};

export default TypeRow;
