import React from "react";
import { Context } from "context/State";
import TypeService from "services/TypeService";
import TypeRow from "components/TypeManager/TypeRow";

const TypeManager = () => {
	const state = React.useContext(Context);
    const [type, setType] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
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
			<table>
				<thead>
					<tr>
						<td>ID</td>
						<td>Name</td>
						<td>Pieces</td>
					</tr>
				</thead>
				<tbody>
					{/*type.map((current) => (
						<TypeRow key={current.number} type={current} state="row" />
                    ))*/}
				</tbody>
			</table>
		</div>
	);
};

export default TypeManager;
