import React from "react";
import { useLocation, useHistory } from "react-router";
import UserService from "services/UserService";
import { Context } from "context/State";
import { TextField, Button } from "@material-ui/core";
import "./Login.css";

const useQuery = () => new URLSearchParams(useLocation().search);

const Login = () => {
	const query = useQuery();
	const history = useHistory();
	const state = React.useContext(Context);
	const [formData, setFormData] = React.useState({
		username: "",
		password: "",
	});

	const tryLogin = async () => {
		try {
			const { login } = UserService();
			let res = await login(formData.username, formData.password);
			if (!res.status) {
				//TODO: let them know login failed
				return;
			}
			state.setValidUser(res.status);
			history.push(`/home?secret=${query.get("secret")}`);
		} catch (error) {
			console.warn(error);
		}
	};

	return (
		<div className="login-main">
			<div className="login-container">
				<TextField
					onChange={(event) =>
						setFormData({
							...formData,
							username: event.target.value,
						})
					}
					color="primary"
					label="Username"
					variant="outlined"
					type="text"
				/>
				<TextField
					onChange={(event) =>
						setFormData({
							...formData,
							password: event.target.value,
						})
					}
					color="primary"
					label="Password"
					variant="outlined"
					type="password"
				/>
				<Button onClick={tryLogin} color="primary" variant="outlined">
					Login
				</Button>
			</div>
			<div className="login-footer">Created by Einar Aglen - Version {state.version}</div>
		</div>
	);
};

export default Login;
