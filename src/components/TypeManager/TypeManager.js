import React from "react";
import { Context } from "context/State";
import TypeService from "services/TypeService";
import TypeRow from "./TypeRow";
import "./TypeManager.css";

const TypeManager = () => {
	const state = React.useContext(Context);
	const [isLoading, setIsLoading] = React.useState(true);

	const effectState = React.useRef(state);

	React.useEffect(() => {
		//init guard
		let isMounted = true;
		//import service component
		let { findAllTypes } = TypeService();
		const find = async () => {
			let res = await findAllTypes();
			if (!isMounted) return;
			effectState.current.setTypes(res.types);
			//cancel loading, so site can render
			setIsLoading(false);
		};
		//call function crated in useEffect
		find();
		//clean up function for when component gets unmounted mid call
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div>
			<div className="type">
				{isLoading ? null : (
					<table>
						<thead>
							<tr>
								<td>ID</td>
								<td>Name</td>
								<td>Pieces</td>
							</tr>
						</thead>
						<tbody>
						{false ? null : <TypeRow  type={{}} add />}
							{state.types.map((type) => (
								<TypeRow key={type._id} type={type} action="row" />
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default TypeManager;
