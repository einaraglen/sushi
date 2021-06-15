import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";
import TypeService from "services/TypeService";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

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

	const handleUpdate = async () => {
		setIsLoading(true);
		try {
			let { updateById } = TypeService();
			let res = await updateById(type._id, {
				name: formData.name,
				pieces: formData.pieces,
			});
			if (!res.status) return;
			state.method.setTypes(res.types);
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
			let { addType } = TypeService();
			let res = await addType(formData);
			if (!res.status) return;
			state.method.setTypes(res.types);
		} catch (error) {
			console.warn(error);
		}
		setIsLoading(false);
	};

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			let { deleteType } = TypeService();
			let res = await deleteType(type._id);
			if (!res.status) return;
			state.method.setTypes(res.types);
		} catch (error) {
			console.warn(error);
		}
		setIsLoading(false);
	}

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

export default TypeRow;
