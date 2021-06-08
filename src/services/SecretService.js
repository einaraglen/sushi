import Connection from "./Connection";

const { api } = Connection();
const PATH = "/secret";

const SecretService = () => {
    const validateSecret = (secret) => {
        return api.get(`${PATH}/check/${secret}`).then(
            ({ data }) => data,
            (error) => console.warn(error)
        );
    };

    return { validateSecret };
};

export default SecretService;