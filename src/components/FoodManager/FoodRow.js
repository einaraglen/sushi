import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";
import FoodService from "services/FoodService";
import { MenuItem, FormControl, Select } from "@material-ui/core/";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ContentPicker from "./ContentPicker";

const FoodRow = ({ food, add }) => {
    const state = React.useContext(Context);
    const [inEditMode, setInEditMode] = React.useState(add);
    const [isEdited, setIsEdited] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        number: "",
        name: "",
        content: !food.content ? [] : food.content,
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

    const formatContent = () => {
        let contentString = "";
        if (!food.content || food.content.length === 0)
            return "No Content Found";
        for (let i = 0; i < food.content.length; i++) {
            let current = state.value.contents.find(
                (content) => content._id === food.content[i]
            );
            if (i === food.content.length - 1)
                return (contentString += current.name);
            contentString += `${current.name}, `;
        }
        return contentString;
    };

    const handleContentChange = (newContent) => {
        setFormData({
            ...formData,
            content: newContent,
        });
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
                    formatContent()
                ) : (
                    <ContentPicker
                        content={food.content}
                        handleContentChange={handleContentChange}
                    />
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
                    {add ? (
                        <AddCircleIcon />
                    ) : inEditMode ? (
                        <CancelIcon />
                    ) : (
                        <EditIcon />
                    )}
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
