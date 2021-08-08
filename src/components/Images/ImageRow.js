import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ResponseHandler from "utils/ResponseHandler";
import ImageService from "services/ImageService";
import { Context } from "context/State";
import { CircularProgress } from "@material-ui/core/";

const ImageRow = ({ image }) => {
    const state = React.useContext(Context);
    const { handleResponse } = ResponseHandler();
    const [isLoading, setIsLoading] = React.useState(false);
    
    const handleDelete = async () => {
		state.method.setModalControlls({
			open: true,
			message: "Do you wish to delete Selected Image?",
			actionText: "Yes",
			function: tryDelete,
		});
	};

    const tryDelete = async () => {
        setIsLoading(true);
        state.method.closeModal();
        try {
            const { deleteImage } = ImageService();
            let res = await deleteImage(image.public_id);
            handleResponse(res, "images", state.method.setImages);
        } catch (error) {
            console.warn(error);
        }
        setIsLoading(false);
    };

    let x = 6;
    return (
        <tr>
            <td width={`${100 / x}%`}>
                {new Date(image.created_at).toLocaleString()}
            </td>
            <td width={`${100 / x}%`}>
                <a href={image.url} target="_blank" rel="noreferrer">
                    {image.public_id}
                </a>
            </td>
            <td width={`${100 / x}%`}>
                <img
                    alt="thumbnail"
                    style={{ height: "3rem" }}
                    src={`https://res.cloudinary.com/sushi-panel-images/image/upload/c_thumb,w_200,g_face/${image.public_id}.${image.format}`}
                />
            </td>
            <td width={`${100 / x}%`}>{`${image.height} x ${image.width}`}</td>
            <td width={`${100 / x}%`}>{image.format}</td>
            <td width={`${100 / x}%`}>
                {isLoading ? (
                    <CircularProgress size="1.5rem" />
                ) : (
                    <IconButton
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

export default ImageRow;
