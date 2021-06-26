import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";
import RowControlls from "components/RowControlls/RowControlls";

const TypeRow = ({ content, add }) => {
	const state = React.useContext(Context);
	const [inEditMode, setInEditMode] = React.useState(add);
	const [isEdited, setIsEdited] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [formData, setFormData] = React.useState({
		name: "",
	});

	//check to see if formData !== food object, to schedule available update
	React.useEffect(() => {
		setIsEdited(formData.name === content.name);
	}, [formData, content]);

	const canEdit = () => {
		return !state.value.isEditing || inEditMode;
	};

	const handleEdit = () => {
		if (!inEditMode) {
			//if cancel, reset formData
			setFormData({
				name: content.name,
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
	let x = Object.keys(formData).length + 1.5;
	return (
		<tr>
			<td width={`${100 / x}%`}>{add ? "To be generated" : content._id}</td>
			<td width={`${100 / x}%`}>
				{!inEditMode && !add ? (
					content.name
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
			<RowControlls
                currentObject={content}
                type="contents"
                isLoading={isLoading}
				setIsLoading={setIsLoading}
				formData={formData}
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

export default TypeRow;
