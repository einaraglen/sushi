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
    const [pickedContent, setPickedContent] = React.useState(
        food.content ? food.content : []
    );
    const [formData, setFormData] = React.useState({
        number: "",
        name: "",
        content: pickedContent,
        price: "",
        image: "",
        type: "",
    });

    //check to see if formData !== food object, to schedule available update
    React.useEffect(() => {
        if (formData.content === null) setPickedContent({})
        setIsEdited(
            formData.number === food.number &&
                formData.name === food.name &&
                //compare arrays!
                JSON.stringify(pickedContent) ===
                    JSON.stringify(food.content) &&
                formData.price === food.price &&
                formData.image === food.image &&
                formData.type === food.type
        );
    }, [formData, pickedContent, food]);

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
        state.method.setIsEditing(inEditMode);
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
        if (!pickedContent || setPickedContent.length === 0)
            return "No Content Found";
        for (let i = 0; i < pickedContent.length; i++) {
            let current = state.value.contents.find(
                (content) => content._id === pickedContent[i]
            );
            if (!current) return;
            if (i === pickedContent.length - 1)
                return (contentString += current.name);
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
                    food.price + " kr"
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
                    <a
                        href={`https://res.cloudinary.com/sushi-panel-images/image/upload/c_thumb,w_400,g_face/sushi/${food.image}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img
                            alt={"Sushi piece"}
                            src={`https://res.cloudinary.com/sushi-panel-images/image/upload/c_thumb,w_400,g_face/sushi/${food.image}`}
                            style={{ borderRadius: "50%", height: "3rem" }}
                        />
                    </a>
                ) : (
                    <FormControl
                        style={{ width: "100%" }}
                        size="small"
                        variant="filled"
                        elevation={1}
                    >
                        <Select
                            onChange={(event) => handleFormEvent(event)}
                            name="image"
                            value={formData.image}
                        >
                            {state.value.images.map((image) => (
                                <MenuItem
                                    key={image.public_id}
                                    value={image.public_id}
                                >
                                    <div className="image-menu-item">
                                        <div className="text">{image.public_id}</div>
                                        <img
                                            alt={"thumbnail"}
                                            src={`https://res.cloudinary.com/sushi-panel-images/image/upload/c_thumb,w_30,g_face/${image.public_id}`}
                                            style={{
                                                height: "1.1rem",
                                            }}
                                        />
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
