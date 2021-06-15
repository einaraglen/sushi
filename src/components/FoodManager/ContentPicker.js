import React from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Menu,
} from "@material-ui/core/";
import { Context } from "context/State";

const ContentPicker = ({ content, handleContentChange }) => {
    const state = React.useContext(Context);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [checked, setChecked] = React.useState(() => {
        if (!state.value.contents) return {};
        let checked = {};
        for (let i = 0; i < state.value.contents.length; i++) {
            checked = {
                ...checked,
                [state.value.contents[i]._id]: !content
                    ? false
                    : content.includes(state.value.contents[i]._id),
            };
        }
        return checked;
    });

    //dependancies can be a pain in the ass
    const updateContent = React.useRef(handleContentChange);

    React.useEffect(() => {
        let contentToList = [];
        for (const content in checked) {
            if (checked[content]) contentToList.push(content);
        }
        if (!content || !contentToList) return;
        if (contentToList.toString() === content.toString()) return updateContent.current(content);;
        updateContent.current(contentToList);
    }, [checked]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        setChecked({ ...checked, [event.target.id]: event.target.checked });
    };

    return (
        <div>
            <p onClick={handleClickListItem}>Content</p>
            <Menu
                onClose={handleClose}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <FormControl>
                    <FormGroup>
                        {state.value.contents.map((content) => (
                            <FormControlLabel
                                key={content._id}
                                style={{ paddingLeft: "2rem" }}
                                label={content.name}
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={checked[content._id]}
                                        onChange={(event) =>
                                            handleChange(event)
                                        }
                                        id={content._id}
                                    />
                                }
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Menu>
        </div>
    );
};

export default ContentPicker;
