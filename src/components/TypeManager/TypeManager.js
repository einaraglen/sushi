import React from "react";
import { Context } from "context/State";
import TypeService from "services/TypeService";
import TypeRow from "./TypeRow";
import "./TypeManager.css";

const TypeManager = () => {
	const state = React.useContext(Context);
	const [type, setType] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		//fixes locked edit mode when changing page mid-edit
		state.setIsEditing(false);
		//init guard
		let isMounted = true;
		//import service component
		let { findAll } = TypeService();
		const find = async () => {
			let res = await findAll();
			if (!isMounted) return;
			setType(res.types);
			//cancel loading, so site can render
			setIsLoading(false);
		};
		//call function crated in useEffect
		find();
		//clean up function for when component gets unmounted mid call
		return () => {
			isMounted = false;
		};
	}, [state]);
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
						{true ? null : <TypeRow  type={{}} action="add" />}
							{type.map((current) => (
								<TypeRow key={current._id} type={current} action="row" />
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default TypeManager;
