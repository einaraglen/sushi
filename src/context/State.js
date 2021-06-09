import React from "react";
import { createMuiTheme } from '@material-ui/core/styles';

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

    const theme = createMuiTheme({
        shadows: ["none"],
        palette: {
          primary: {
            light: "hsl(234, 33%, 94%)",
            main: "hsl(240, 1%, 23%)",
            dark: "hsl(204, 86%, 6%)",
            contrastText: "hsl(240, 1%, 23%)",
          },
        },
      });

    //TODO: Setup all that state variable needs
    state = {
        version: "0.0.1",
        theme: theme,
        validUser: validUser,
        setValidUser,
        isEditing: isEditing,
        setIsEditing,
    };

    return <Context.Provider value={state}>{children}</Context.Provider>;
};

//Import and de-structure with React.userContext(-- context variable --)
export const Context = React.createContext(state);
//Wrap Around App
export default State;
