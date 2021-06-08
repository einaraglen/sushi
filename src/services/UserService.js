import Connection from "./Connection";

const { api } = Connection();
const PATH = "/user";

const UserService = () => {
    const validateToken = () => {
        return api.get(`${PATH}/validate`).then(
            ({ data }) => data,
            (error) => console.warn(error)
        );
    };

    const loginUser = (username, password) => {
        return api
            .post(`${PATH}/login`, {
                username: username,
                password: password,
            })
            .error((error) => console.warn(error));
    };

    const refreshToken = () => {
        return api.get(`${PATH}/refresh`).then(
            ({ data }) => data,
            (error) => console.warn(error)
        );
    };

    return { validateToken, loginUser, refreshToken };
};

export default UserService;
