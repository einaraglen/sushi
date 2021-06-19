import React from "react";
import { useLocation, useHistory } from "react-router";
import UserService from "services/UserService";
import { Context } from "context/State";
import { TextField, Button } from "@material-ui/core";
import "./Login.css";

const useQuery = () => new URLSearchParams(useLocation().search);

document.title = "Login | Sushi"

const Login = () => {
	const query = useQuery();
	const history = useHistory();
	const state = React.useContext(Context);
	const [error, setError] = React.useState({
		status: false,
		message: "",
	});
	const [formData, setFormData] = React.useState({
		username: "",
		password: "",
	});

	const tryLogin = async () => {
		try {
			const { login } = UserService();
			let res = await login(formData.username, formData.password);
			if (!res.status) {
				setError({
					status: true,
					message: res.message,
				});
				return;
			}
			state.method.setValidUser(res.status);
			history.push(`/home?secret=${query.get("secret")}`);
		} catch (error) {
			console.warn(error);
		}
	};

	return (
		<div className="login-main">
			<div className="login-container">
				<TextField
					error={error.status}
					onChange={(event) =>
						setFormData({
							...formData,
							username: event.target.value,
						})
					}
					color="primary"
					label="Username"
					variant="filled"
					type="text"
				/>
				<TextField
					error={error.status}
					onChange={(event) =>
						setFormData({
							...formData,
							password: event.target.value,
						})
					}
					helperText={error.message}
					color="primary"
					label="Password"
					variant="filled"
					type="password"
				/>
				<Button onClick={tryLogin} color="primary" variant="text">
					Login
				</Button>
			</div>
			<div className="login-footer">Created by Einar Aglen - Version {state.version}</div>
		</div>
	);
};

export default Login;
