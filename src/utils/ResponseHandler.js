import React from "react";
import { Context } from "context/State";

const ResponseHandler = () => {
    const state = React.useContext(Context);

	const handleResponse = (res, value, setFunction) => {
		if (!res) return state.method.setSnackControlls({ open: true, message: "Network Error" });
		if (!res.status)
			return state.method.setSnackControlls({ open: true, message: res.message });
		state.method.setSnackControlls({ open: true, message: res.message });
		setFunction(res[value]);
	};

    return { handleResponse }
};

export default ResponseHandler;
