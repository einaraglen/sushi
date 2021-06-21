import Connection from "./Connection";

const { api } = Connection();
const PATH = "/order";

const OrderService = () => {
	const add = (order) => {
		return api
			.post(`${PATH}/add`, order)
			.then(
				({ data }) => data,
				(error) => console.warn(error)
			);
	};

	const updateById = (id, update) => {
		return api
			.put(`${PATH}/update`, {
				id: id,
				update: update,
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

	return { add, updateById, findAllOrders };
};

export default OrderService;
