import React from "react";
import { Context } from "context/State";
import ContentService from "services/ContentService";
import { CircularProgress } from "@material-ui/core/";
import ContentRow from "./ContentRow";
import "./ContentManager.css";

const ContentManager = () => {
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
		let { findAllContents } = ContentService();
		const find = async () => {
			let res = await findAllContents();
			if (!isMounted) return;
			effectState.current.method.setContents(res.contents);
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
				<div className="content-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
			) : (
				<div className="content">
					{isLoading ? null : (
						<table>
							<thead>
								<tr>
									<td>ID</td>
									<td>Name</td>
								</tr>
							</thead>
							<tbody>
								{false ? null : <ContentRow content={{}} add />}
								{state.value.contents.map((content) => (
									<ContentRow key={content._id} content={content} />
								))}
							</tbody>
						</table>
					)}
				</div>
			)}
		</div>
	);
};

export default ContentManager;
