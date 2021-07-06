import React from "react";
import { Context } from "context/State";

const ImageRow = ({ image }) => {
    const state = React.useContext(Context);
    return (
        <tr>
            <td>{new Date(image.created_at).toLocaleString()}</td>
            <td>{image.filename}</td>
            <td>{`${image.height} x ${image.width}`}</td>
            <td>{image.format}</td>
            <td>{image.access_mode}</td>
        </tr>
    );
};

export default ImageRow;
