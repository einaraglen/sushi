import axios from "axios";

const api = axios.create({
	//withCredentials: true,
});

const ImageService = () => {
	//add image to imgur
	const addImage = (CLIENT_ID, file) => {
		//setup fromData and send to imgur
		const imgurForm = new FormData();
		imgurForm.append("image", file.stream);
        const config = {
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
              Authorization: `Client-ID ${CLIENT_ID}`,
            },
          };
        //try the post, and return result upwards
		return api
			.post("https://api.imgur.com/3/image", imgurForm, config)
			.then(
				({ data }) => data,
				(error) => console.warn(error)
			);
	};

	const getId = () => {
		return api.get("https://sush-backend.herokuapp.com/image/token", {withCredentials: true}).then(
			({ data }) => data,
			(error) => console.warn(error)
		);
	};

	return { addImage, getId };
};

export default ImageService;
