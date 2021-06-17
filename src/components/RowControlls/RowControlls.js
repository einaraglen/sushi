import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Context } from "context/State";
import FoodService from "services/FoodService";
import TypeService from "services/TypeService";
import ContentService from "services/ContentService";
import ResponseHandler from "utils/ResponseHandler";

const RowControlls = ({
    currentObject,
    type,
    isLoading,
    setIsLoading,
    formData,
    inEditMode,
    handleEdit,
    canEdit,
    isEdited,
    add,
}) => {
    const state = React.useContext(Context);
    const { handleResponse } = ResponseHandler();

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            let { updateById } = getCurrentService();

            let res = await updateById(currentObject._id, formData);
            setIsLoading(false);
            handleResponse(
                res,
                `${type}`,
                state.method[
                    `set${type.charAt(0).toUpperCase() + type.slice(1)}`
                ]
            );
            //switch out of edit mode
            handleEdit();
        } catch (error) {
            console.warn(error);
        }
    };

    const handleAdd = async () => {
        setIsLoading(true);
        try {
            let { add } = getCurrentService();
            let res = await add(formData);
            setIsLoading(false);
            handleResponse(
                res,
                `${type}`,
                state.method[
                    `set${type.charAt(0).toUpperCase() + type.slice(1)}`
                ]
            );
        } catch (error) {
            console.warn(error);
        }
    };

    const handleDelete = async () => {
        //launch modal to comfirm delete
        state.method.setModalControlls({
            open: true,
            message: `Do you wish to delete selected ${
                type.charAt(0).toUpperCase() + type.slice(1)
            }?`,
            actionText: "Yes",
            delete: true,
        });

        //wait for modal to be closed
       	await modalClose();

        //early return if delete is cancelled
        if (!state.value.confirmDelete) return;

        setIsLoading(true);
        try {
            let { deleteById } = getCurrentService();
            let res = await deleteById(currentObject._id);
            setIsLoading(false);
            handleResponse(
                res,
                `${type}`,
                state.method[
                    `set${type.charAt(0).toUpperCase() + type.slice(1)}`
                ]
            );
        } catch (error) {
            console.warn(error);
        }
    };

    const modalClose = () => {
        
    };

    const getCurrentService = () => {
        if (type === "foods") return FoodService();
        if (type === "types") return TypeService();
        if (type === "contents") return ContentService();
        return null;
    };

    return (
        <>
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
        </>
    );
};

export default RowControlls;
