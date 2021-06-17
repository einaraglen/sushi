import React from "react";
import { CircularProgress } from "@material-ui/core/";
import { Context } from "context/State";
import TypeService from "services/TypeService";
import TypeRow from "./TypeRow";
import "./TypeManager.css";

const TypeManager = () => {
	const state = React.useContext(Context);
	const [isLoading, setIsLoading] = React.useState(true);

	//workaround to using context inside useEffect without infinity loop
	const effectState = React.useRef(state);

	React.useEffect(() => {
		//resets global edit for when manager is init
		effectState.current.method.setIsEditing(false);
		//init guard
		let isMounted = true;
		//import service component
		let { findAllTypes } = TypeService();
		const find = async () => {
			let res = await findAllTypes();
			if (!isMounted) return;
			effectState.current.method.setTypes(res.types);
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
			{isLoading ? (
				<div className="type-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
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
								{false ? null : <TypeRow type={{}} add />}
								{state.value.types.map((type) => (
									<TypeRow key={type._id} type={type} />
								))}
							</tbody>
						</table>
					)}
				</div>
			)}
		</div>
	);
};

export default TypeManager;
