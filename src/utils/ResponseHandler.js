import React from "react";
import { Context } from "context/State";
import UserService from "services/UserService";

const ResponseHandler = () => {
	const state = React.useContext(Context);
	const { refreshToken, logout } = UserService();

	//good example of good behavior design
	const handleResponse = (res, value, setFunction) => {
		//res is null if connection to API does not work
		if (!res) return networkErrorResponse();

		//if message contains "<Table> validation failed" if trying to add without all parameters
		if (res.message.indexOf("validation failed") > -1) return missingParamResponse(res);

		if (res.message.indexOf("duplicate key") > -1) return duplicateKeyError(res);

		//if message contains "TokenExpiredError" ACCESS_TOKEN needs to be refreshed
		if (res.message.indexOf("TokenExpiredError") > -1) return openRefreshModal();

		//status is false so something might have gone wrong
		if (!res.status) return errorResponse(res);

		//all good so we let the client know
		state.method.setSnackControlls({ open: true, message: res.message });

		//takes the given setFunction and extract the res.<key> to use in the setter
		setFunction(res[value]);
	};

	const networkErrorResponse = () => {
		state.method.setSnackControlls({
			open: true,
			message: "Network Error!",
		});
	};

	const duplicateKeyError = (res) => {
		state.method.setSnackControlls({
			open: true,
			//first word of message string is Table-variant
			message: `Error Adding: ${
				res.message.split("{")[1].replace(" ", "").replace("}", "").replace(":", "")
			} already exists`,
		});
	}

	const missingParamResponse = (res) => {
		state.method.setSnackControlls({
			open: true,
			//first word of message string is Table-variant
			message: `Could not add ${
				res.message.split(" ")[0]
			}, Please check that all fields are filled`,
		});
	};

	const errorResponse = (res) => {
		state.method.setSnackControlls({
			open: true,
			message: res.message,
		});
	};

	const openRefreshModal = () => {
		state.method.setModalControlls({
			open: true,
			message: "Session has expired, resolve to renew Token",
			actionText: "Resolve",
			function: tryRefresh,
		});
	};

	const tryRefresh = async () => {
        try {
            let res = await refreshToken();
			state.method.setValidUser(res.status);
			//if refresh fails
			if (!res.status) await logout();
			state.method.closeModal();
            //give feedback with status from atempt
            state.method.setSnackControlls({
				open: true,
				message: res.message,
			});
        } catch (error) {
            console.warn(error);
        }
    };

	return { handleResponse };
};

export default ResponseHandler;
