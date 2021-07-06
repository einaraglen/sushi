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

	const findAllImages = () => {
		return api.get(`${PATH}/all`).then(
			({ data }) => data,
			(error) => console.warn(error)
		);
	};

    return { upload, findAllImages };
};

export default ImageService;
