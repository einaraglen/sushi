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

	const add = (food) => {
		return api
			.post(`${PATH}/add`, {
				food: food,
			})
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

	const deleteById = (id) => {
		return api
			.delete(
				`${PATH}/delete`,
				{
					data: {
						id: id,
					},
				},
				{
					"Content-Type": "application/json",
				}
			)
			.then(
				({ data }) => data,
				(error) => console.warn(error)
			);
	};

	const findAllFoods = () => {
		return api.get(`${PATH}/all`).then(
			({ data }) => data,
			(error) => console.warn(error)
		);
	};

	return { findByName, add, updateById, deleteById, findAllFoods };
};

export default FoodService;
