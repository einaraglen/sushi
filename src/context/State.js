import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";

//Inits state variable that we pass to the app
let state = {};

/**
 * Creates a usable Context that can be accessed from any component in the app
 * using const state = React.useContext(Context); where Context variable is imported
 * From /context/State
 */
const State = ({ children }) => {
	//Check for if the user is logged in
	const [validUser, setValidUser] = React.useState(false);
	const [isEditing, setIsEditing] = React.useState(false);
	const [foods, setFoods] = React.useState([]);
	const [types, setTypes] = React.useState([]);
	const [contents, setContents] = React.useState([]);

	const theme = createMuiTheme({
		shadows: ["none"],
		palette: {
			primary: {
				light: "hsl(128, 26%, 60%)",
				main: "hsl(128, 26%, 40%)",
				dark: "hsl(128, 26%, 30%)",
				contrastText: "hsl(120, 4%, 91%)",
			},
		},
	});

	//TODO: Setup all that state variable needs
	state = {
		version: "0.0.6",
		theme: theme,
		value: {
			foods: foods,
			types: types,
			contents: contents,
			validUser: validUser,
			isEditing: isEditing,
		},
		method: {
			setFoods,
			setTypes,
			setContents,
			setValidUser,
			setIsEditing,
		},
	};

	return <Context.Provider value={state}>{children}</Context.Provider>;
};

//Import and de-structure with React.userContext(-- context variable --)
export const Context = React.createContext(state);
//Wrap Around App
export default State;
