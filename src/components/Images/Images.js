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
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ResponseHandler from "utils/ResponseHandler";
//import { Roller } from 'react-spinners-css';

const useQuery = () => new URLSearchParams(useLocation().search);

const Images = () => {
    const query = useQuery();
    const state = React.useContext(Context);
    const history = useHistory();
    const { handleResponse } = ResponseHandler();
    const secret = query.get("secret");
    const [isLoading, setIsLoading] = React.useState(true);
    const [isUploading, setIsUploading] = React.useState(false);
    const [currentSort, setCurrentSort] = React.useState(query.get("sort"));
    const [currentSearch, setCurrentSearch] = React.useState(
        query.get("search")
    );

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
            effectState.current.method.setImages(res.images);
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
        if (state.value.images.length === 0) return [];
        //init temp data
        let handled = [...state.value.images];
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

    const handleInputChange = async (event) => {
        setIsUploading(true);
        try {
            //get the method from service
            let { upload } = ImageService();
            //setup our formdata for file
            let formData = new FormData();
            formData.append("image", event.target.files[0]);
            //call method
            let res = await upload(formData);
            //let response handler do the rest
            handleResponse(res, "images", state.method.setImages);
            setIsUploading(false);
        } catch (error) {
            console.warn(error);
        }
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
                            disabled={isUploading}
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
                                disabled={isUploading}
                            >
                                <MenuItem value={"created_at"}>
                                    Uploaded
                                </MenuItem>
                                <MenuItem value={"height"}>Size</MenuItem>
                                <MenuItem value={"format"}>Format</MenuItem>
                                <MenuItem value={"access_mode"}>
                                    Access
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <input
                            id="file-button"
                            style={{ display: "none" }}
                            accept="image/*"
                            type="file"
                            name="upload_file"
                            onChange={handleInputChange}
                        />
                        {isUploading ? (
                            <div
                                style={{
                                    display: "flex",
                                    gridArea: "button",
                                    width: "7rem",
                                    margin: "auto",
                                }}
                            >
                                {/*<Roller color="hsl(128, 26%, 30%)" height={10} size={30} />*/}
                                {<CircularProgress size="1.6rem" />}
                            </div>
                        ) : (
                            <label
                                style={{
                                    gridArea: "button",
                                    width: "7rem",
                                    margin: "auto",
                                }}
                                htmlFor="file-button"
                            >
                                <Button
                                    component="span"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload
                                </Button>
                            </label>
                        )}
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Uploaded</td>
                                <td>Filename</td>
                                <td>Preview</td>
                                <td>Size(HxW)</td>
                                <td>Format</td>
                                <td></td>
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
