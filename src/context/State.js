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
	const [images, setImages] = React.useState([]);
	const [orders, setOrders] = React.useState([]);
	const [archives, setArchives] = React.useState([]);
	const [confirmDelete, setConfirmDelete] = React.useState(false);
	const [addOpen, setAddOpen] = React.useState(false);

	const [snackControlls, setSnackControlls] = React.useState({
		open: false,
		message: undefined,
		success: false,
	});

	const [modalControlls, setModalControlls] = React.useState({
		open: false,
		message: undefined,
		actionText: undefined,
		action: undefined,
	});

	//style overriding Material UI components
	const theme = createMuiTheme({
		overrides: {
			MuiButton: {
				contained: {
					boxShadow: "none",
				},
			},
			MuiTouchRipple: {
				child: {
					backgroundColor: "hsl(128, 26%, 40%)",
				},
			},
			MuiListItem: {
				button: {
					"&:hover": {
						backgroundColor: "hsl(0, 0%, 23%)",
					},
				},
			},
			MuiListItemText: {
				root: {
					color: "hsl(0, 0%, 86%)",
				},
			},
			MuiFormLabel: {
				root: {
					color: "hsl(0, 0%, 86%)",
				},
			},
			MuiInputBase: {
				root: {
					color: "hsl(0, 0%, 86%)",
				},
			},
			MuiMenu: {
				paper: {
					backgroundColor: "hsl(0, 0%, 22%)",
					boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
					color: "hsl(0, 0%, 86%)",
				},
			},
			MuiMenuItem: {
				root: {
					"&$selected, &$selected:hover, &$selected:focus": {
						backgroundColor: "hsl(0, 0%, 16%)",
					},
				},
			},
		},
		typography: {
			htmlFontSize: 20,
		},
		palette: {
			primary: {
				light: "hsl(128, 26%, 60%)",
				main: "hsl(128, 26%, 32%)",
				dark: "hsl(128, 26%, 30%)",
				contrastText: "hsl(120, 4%, 91%)",
			},
			secondary: {
				light: "hsl(355, 52%, 82%)",
				main: "hsl(355, 92%, 62%)",
				dark: "hsl(355, 52%, 32%)",
				contrastText: "hsl(120, 4%, 91%)",
			},
		},
	});

	const closeModal = () => {
		setModalControlls({
			open: false,
			message: undefined,
			actionText: undefined,
			function: undefined,
		});
	};

	//this will be accessable from all the components that import Context variable
	state = {
		version: "0.1.5",
		theme: theme,
		value: {
			foods: foods,
			types: types,
			contents: contents,
			images: images,
			orders: orders,
			archives: archives,
			validUser: validUser,
			isEditing: isEditing,
			snackControlls: snackControlls,
			modalControlls: modalControlls,
			confirmDelete: confirmDelete,
			addOpen: addOpen,
		},
		method: {
			setFoods,
			setTypes,
			setContents,
			setImages,
			setOrders,
			setArchives,
			setValidUser,
			setIsEditing,
			setSnackControlls,
			setModalControlls,
			setConfirmDelete,
			closeModal,
			setAddOpen,
		},
	};

	return <Context.Provider value={state}>{children}</Context.Provider>;
};

//import and de-structure with React.useContext(-- context variable --)
export const Context = React.createContext(state);
//wrap Around App
export default State;
