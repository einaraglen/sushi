import Connection from "./Connection";

const { api } = Connection();
const PATH = "/image";

const ImageService = () => {
	const upload = (formData) => {
		return api
			.post(`${PATH}/upload`, formData)
			.then(
				({ data }) => data,
				(error) => console.warn(error)
			);
	};

	return { upload };
};

export default ImageService;
