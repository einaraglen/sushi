import React from "react";
import { CircularProgress } from "@material-ui/core/";
import { Context } from "context/State";
import { TextField, Button } from "@material-ui/core";
import { MenuItem, FormControl, Select } from "@material-ui/core/";
import InputLabel from "@material-ui/core/InputLabel";
import { useLocation, useHistory } from "react-router-dom";
import ImageService from "services/ImageService";
import ImageRow from "./ImageRow";
import "./Images.css";

const useQuery = () => new URLSearchParams(useLocation().search);

const Images = () => {
    const query = useQuery();
    const state = React.useContext(Context);
    const history = useHistory();
    const secret = query.get("secret");
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentSort, setCurrentSort] = React.useState(query.get("sort"));
    const [currentSearch, setCurrentSearch] = React.useState(
        query.get("search")
    );
    const [addOpen, setAddOpen] = React.useState(false);
    const [images, setImages] = React.useState([]);

    //workaround to using context inside useEffect without infinity loop
    const effectState = React.useRef(state);
    const effectHistory = React.useRef(history);

    React.useEffect(() => {
        //resets global edit for when manager is init
        effectState.current.method.setIsEditing(false);
        //init guard
        let isMounted = true;
        //import service component
        let { findAllImages } = ImageService();
        const find = async () => {
            let res = await findAllImages();
            if (!isMounted) return;
            setImages(res.images);
            //cancel loading, so site can render
            setIsLoading(false);
        };
        //call function crated in useEffect
        find();
        //clean up function for when component gets unmounted mid call
        return () => {
            isMounted = false;
        };
    }, []);

    //listen to any change in variables and change path
    React.useEffect(() => {
        effectHistory.current.push(
            `/home/all-images?search=${currentSearch}&sort=${currentSort}&secret=${secret}`
        );
    }, [currentSort, currentSearch, secret]);

    const handleData = () => {
        if (images.length === 0) return [];
        //init temp data
        let handled = [...images];
        //filter if search has been choosen
        if (query.get("search") !== "null")
            handled = handled.filter(
                (image) =>
                    image.name.toLowerCase().indexOf(query.get("search")) > -1
            );
        //sort if sort has been choosen
        if (query.get("sort") !== "null")
            handled = handled.sort((a, b) =>
                a[query.get("sort")] > b[query.get("sort")] ? 1 : -1
            );

        return handled;
    };

    const handleFormChange = (event) => {
        setCurrentSort(
            event.target.value !== "null" ? event.target.value : "_id"
        );
    };

    return (
        <div>
            {isLoading ? (
                <div className="type-loading">
                    <CircularProgress
                        size="4rem"
                        style={{ padding: 0, marginTop: "15rem" }}
                    />
                </div>
            ) : (
                <div className="type">
                    <div className="type-nav">
                        <TextField
                            onChange={(event) =>
                                setCurrentSearch(
                                    event.target.value.length > 0
                                        ? event.target.value.toLowerCase()
                                        : "null"
                                )
                            }
                            style={{ gridArea: "search" }}
                            label="Search"
                            variant="filled"
                            size="small"
                            type="text"
                        />
                        <FormControl
                            style={{ gridArea: "sort" }}
                            size="small"
                            variant="filled"
                            elevation={1}
                            label="Search"
                        >
                            <InputLabel>Sort by</InputLabel>
                            <Select
                                onChange={(event) => handleFormChange(event)}
                                value={currentSort}
                                label="Search"
                            >
                                <MenuItem value={"created_at"}>Uploaded</MenuItem>
                                <MenuItem value={"height"}>Size</MenuItem>
                                <MenuItem value={"format"}>Format</MenuItem>
                                <MenuItem value={"access_mode"}>Access</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            onClick={() => setAddOpen(!addOpen)}
                            style={{
                                gridArea: "button",
                                width: "7rem",
                                margin: "auto",
                            }}
                            color="primary"
                            variant="contained"
                        >
                            {!addOpen ? "Add" : "Close"}
                        </Button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Uploaded</td>
                                <td>Filename</td>
                                <td>Preview</td>
                                <td>Size(HxW)</td>
                                <td>Format</td>
                                <td>Access Mode</td>
                            </tr>
                        </thead>
                        <tbody>
                            {handleData().map((image) => (
                                <ImageRow key={image.filename} image={image} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Images;
