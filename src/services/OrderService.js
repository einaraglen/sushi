import Connection from "./Connection";

const { api } = Connection();
const PATH = "/order";

const OrderService = () => {
	const add = (type) => {
		return api
			.post(`${PATH}/add`, {
				type: type,
			})
			.then(
				({ data }) => data,
				(error) => console.warn(error)
			);
	};

	const findAllOrders = () => {
		return api.get(`${PATH}/all`).then(
			({ data }) => data,
			(error) => console.warn(error)
		);
	};

	return { add, findAllOrders };
};

export default OrderService;
