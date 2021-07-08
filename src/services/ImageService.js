import Connection from "./Connection";

const { api } = Connection();
const PATH = "/image";

const ImageService = () => {
    const upload = (formData) => {
        return api.post(`${PATH}/upload`, formData).then(
            ({ data }) => data,
            (error) => console.warn(error)
        );
    };

    const deleteImage = (public_id) => {
        return api
            .put(`${PATH}/destroy`, {
                public_id: public_id,
            })
            .then(
                ({ data }) => data,
                (error) => console.warn(error)
            );
    };

    const findAllImages = () => {
        return api.get(`${PATH}/all`).then(
            ({ data }) => data,
            (error) => console.warn(error)
        );
    };

    return { upload, deleteImage, findAllImages };
};

export default ImageService;
