import React from "react";
import { TextField, Button } from "@material-ui/core";
import { Context } from "context/State";
import FoodService from "services/FoodService";
import { MenuItem, FormControl, Select } from "@material-ui/core/";

const FoodRow = ({ food, add }) => {
    const state = React.useContext(Context);
    const [inEditMode, setInEditMode] = React.useState(add);
    const [isEdited, setIsEdited] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
	const [formData, setFormData] = React.useState({
        number: "",
        name: "",
        price: "",
        image: "",
        type: "",
    });
    /*const [formData, setFormData] = React.useState({
        number: !food.number ? "" : food.number,
        name: !food.name ? "" : food.name,
        price: !food.price ? "" : food.price,
        image: !food.image ? "" : food.image,
        type: !food.type ? "" : food.type,
    });*/

    //check to see if formData !== food object, to schedule available update
    React.useEffect(() => {
        setIsEdited(
            formData.number === food.number &&
                formData.name === food.name &&
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
                price: food.price,
                image: food.image,
                type: food.type,
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
                type: formData.type,
            });
            if (!res.status) return;
			state.setFoods(res.foods);
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
			console.log(res)
            if (!res.status) return;
            //switch out of edit mode
            handleEdit();
        } catch (error) {
            console.warn(error);
        }
        setIsLoading(false);
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
                    `${
                        state.types.find((type) => type._id === food.type).name
                    } (${
                        state.types.find((type) => type._id === food.type)
                            .pieces
                    } each)`
                ) : (
                    <FormControl size="small" variant="filled" elevation={1}>
                        <Select
                            onChange={(event) => handleFormChange(event)}
                            name="type"
                            label="Generation"
                            value={formData.type}
                        >
                            {state.types.map((type) => (
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
                <Button
                    disabled={!canEdit() || isLoading}
                    onClick={add ? handleAdd : handleEdit}
                    color={inEditMode && !add ? "secondary" : "primary"}
                    variant="text"
                    style={{ width: "5rem" }}
                >
                    {add ? "Add" : inEditMode ? "Cancel" : "Edit"}
                </Button>
            </td>
            <td>
                {add ? null : (
                    <Button
                        disabled={isEdited || !inEditMode || isLoading}
                        onClick={handleUpdate}
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

export default FoodRow;
