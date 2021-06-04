import React from "react";

//Inits state variable that we pass to the app
let state = {};

/**
 * Creates a usable Context that can be accessed from any component in the app
 * using const state = React.useContext(Context); where Context variable is imported
 * From /context/State
 */
const State = ({ children }) => {
    const [value, setValue] = React.useState(0);

    //TODO: Setup all that state variable needs
    state = {
        test: "test",
        value: value,
        setValue,
    };

    return <Context.Provider value={state}>{children}</Context.Provider>;
};

//Import and de-structure with React.userContext(-- context variable --)
export const Context = React.createContext(state);
//Wrap Around App
export default State;
