import axios from "axios";

/**
 * Compontent Services can use to get the axios instance
 * that is calling on the backen api
 * @returns {Function} for calling on api
 */
const Connection = () => {

    /**
     * Method that is used by services to call on the api 'api.post()' / 'api.get()'
     */
    const api = axios.create({
        withCredentials: true,
        baseURL: "http://localhost:8080/",
    });

    return { api };
};

export default Connection;
