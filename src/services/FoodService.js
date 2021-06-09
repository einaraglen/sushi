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

    const findAll = () => {
        return api.get(`${PATH}/all`).then(
            ({ data }) => data,
            (error) => console.warn(error)
        );
    }

    return { findByName, findAll };
};

export default FoodService;