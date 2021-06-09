import Connection from "./Connection";

const { api } = Connection();
const PATH = "/food";

const FoodService = () => {
    const findByName = (search) => {
        return api.get(`${PATH}/find/${search}`).then(
            ({ data }) => data,
            (error) => console.warn(error)
        );
    };

    return { findByName };
};

export default FoodService;