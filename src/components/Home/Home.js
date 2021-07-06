import React from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { Context } from "context/State";
import FoodManager from "components/FoodManager/FoodManager";
import ContentManager from "components/ContentManager/ContentManager";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./Home.css";
import TypeManager from "components/TypeManager/TypeManager";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import InfoModal from "./InfoModal";
import logo from "images/logo-bigger.svg";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Button } from "@material-ui/core";
import UserService from "services/UserService";
import Slide from "@material-ui/core/Slide";
import HomeContent from "components/HomeContent/HomeContent";
import Images from "components/Images/Images";

const useQuery = () => new URLSearchParams(useLocation().search);

const Home = () => {
    const query = useQuery();
    const state = React.useContext(Context);
    const { logout } = UserService();

    const handleLogout = async () => {
        try {
            await logout();
            //wipe tokens || old method, does not work with secure cookies
            /*document.cookie =
            "ACCESS_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie =
            "REFRESH_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";*/
            //set valid variable to false
            state.method.setValidUser(false);
        } catch (error) {
            console.warn(error);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        state.method.setSnackControlls({ open: false, message: undefined });
    };

    const handleExited = () => {
        state.method.setSnackControlls({ open: false, message: undefined });
    };

    return (
        <div className="home">
            <div className="home-top-nav">
                <img alt="logo" src={logo} />
                <p style={{ gridArea: "text", color: "#000", margin: "auto" }}>
                    SushiManager
                </p>
                <Button
                    onClick={handleLogout}
                    style={{ gridArea: "logout" }}
                    color="default"
                    variant="text"
                >
                    <ExitToAppIcon />
                </Button>
            </div>
            <div className="home-side-nav">
                <List component="nav">
                    <Link to={`/home?tab=orders&secret=${query.get("secret")}`}>
                        <ListItem button>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </Link>
                    <Link
                        to={`/home/manage-food?search=${null}&sort=${"number"}&secret=${query.get(
                            "secret"
                        )}`}
                    >
                        <ListItem button>
                            <ListItemText primary="Manage Food" />
                        </ListItem>
                    </Link>
                    <Link
                        to={`/home/manage-types?search=${null}&sort=${"_id"}&secret=${query.get(
                            "secret"
                        )}`}
                    >
                        <ListItem button>
                            <ListItemText primary="Manage Types" />
                        </ListItem>
                    </Link>
                    <Link
                        to={`/home/manage-content?search=${null}&sort=${"_id"}&secret=${query.get(
                            "secret"
                        )}`}
                    >
                        <ListItem button>
                            <ListItemText primary="Manage Content" />
                        </ListItem>
                        <Link
                            to={`/home/all-images?search=${null}&sort=${"created_at"}&secret=${query.get(
                                "secret"
                            )}`}
                        >
                            <ListItem button>
                                <ListItemText primary="All Images" />
                            </ListItem>
                        </Link>
                    </Link>
                </List>
            </div>
            <div className="home-content">
                <Switch>
                    <Route exact path="/home">
                        <HomeContent />
                    </Route>
                    <Route path={`/home/manage-food`}>
                        <FoodManager />
                    </Route>
                    <Route path={`/home/manage-types`}>
                        <TypeManager />
                    </Route>
                    <Route path={`/home/manage-content`}>
                        <ContentManager />
                    </Route>
                    <Route path={`/home/all-images`}>
                        <Images />
                    </Route>
                </Switch>
            </div>
            <div className="home-footer">
                Created by Einar Aglen - Version {state.version}
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                TransitionComponent={Slide}
                open={state.value.snackControlls.open}
                autoHideDuration={6000}
                onClose={handleClose}
                onExited={handleExited}
                message={
                    state.value.snackControlls.message
                        ? state.value.snackControlls.message
                        : undefined
                }
                action={
                    <React.Fragment>
                        <IconButton
                            aria-label="close"
                            color="primary"
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                }
            />
            <InfoModal />
        </div>
    );
};

export default Home;
