import React from "react";
import "./App.css";
import {
    Route,
    Redirect,
    Switch,
    useLocation,
    useHistory,
} from "react-router-dom";
import Home from "components/Home/Home";
import Login from "components/Login/Login";
import NoAccess from "components/NoAccess/NoAccess";
import { Context } from "context/State";
import UserService from "services/UserService";
import SecretService from "services/SecretService";
import { ThemeProvider } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core/";

const useQuery = () => new URLSearchParams(useLocation().search);

const App = () => {
    const state = React.useContext(Context);
    const query = useQuery();
    const history = useHistory();
    const [isLoading, setIsLoading] = React.useState(true);
    const location = useLocation();

    //workaround to using context inside useEffect without infinity loop
    const effectState = React.useRef(state);
    const effectQuery = React.useRef(query);
    const effectHistory = React.useRef(history);

    //check cookie from browser on Render
    React.useEffect(() => {
        //init guard
        let isMounted = true;
        //import service component
        let { validateToken, refreshToken } = UserService();
        //create async function for getting data
        const validate = async () => {
            let res = await validateToken();
			//console.log("[1] " + res.status)
            if (!isMounted) return;
            if (!res.status) {
                let refresh_res = await refreshToken();
				//console.log("[2] " + refresh_res.status)
                effectState.current.method.setValidUser(refresh_res.status);
            } else {
				effectState.current.method.setValidUser(res.status);
			}
            //cancel loading, so site can render
			setIsLoading(false);
        };
        //call function crated in useEffect
        validate();
        //clean up function for when component gets unmounted mid call
        return () => {
            isMounted = false;
        };
    }, []);

    //check secret link
    React.useEffect(() => {
        //import service component
        let { validateSecret } = SecretService();
        //create async function for getting data
        const validate = async () => {
            if (!effectQuery.current.get("secret")) return;
            let res = await validateSecret(effectQuery.current.get("secret"));
            if (res === undefined) return;
            if (!res.status) return effectHistory.current.push("/acces-denied");
        };

        //updates title based on path
        const updateTitle = () => {
            let path = location.pathname.split("/");
            let title = path[path.length - 1].split("-");
            if (title.length === 1) {
                let string =
                    title[0].charAt(0).toUpperCase() + title[0].slice(1);
                return (document.title = `${string} | SushiManager`);
            }
            
            let completeTitle = "";
            for (let i = 0; i < title.length; i++) {
                completeTitle +=
                    title[i].charAt(0).toUpperCase() + title[i].slice(1);
                completeTitle += i === title.length - 1 ? "" : " ";
                if (i === title.length - 1)
                    return (document.title = `${completeTitle} | SushiManager`);
            }
        };
        //call function crated in useEffect
        validate();
        updateTitle();
    }, [query, location]);

    return (
        <ThemeProvider theme={state.theme}>
            {isLoading ? (
                <div className="app-loading">
					<CircularProgress size="4rem" style={{ padding: 0, marginTop: "15rem" }} />
				</div>
            ) : (
                <Switch>
                    <Route path="/home">
                        {!state.value.validUser ? (
                            <Redirect
                                to={`/login?secret=${query.get("secret")}`}
                            />
                        ) : (
                            <Home />
                        )}
                    </Route>
                    <Route path="/login">
                        {state.value.validUser ? (
                            <Redirect
                                to={`/home?secret=${query.get("secret")}`}
                            />
                        ) : (
                            <Login />
                        )}
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/login?secret=b0b4b9efc5308ccea7475eb251de1d73f6b97f9a2d8f8ed829143180d3dcabeb109084418e69bf1d2ff601a002001e186c902a6a128807ca0673371fb90b2220" />
                    </Route>
                    <Route path="*">
                        <NoAccess />
                    </Route>
                </Switch>
            )}
        </ThemeProvider>
    );
};

export default App;
