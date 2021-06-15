import React from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, Menu } from "@material-ui/core/";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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

	//dependancies can be a pain in the ass ref to variable will be yourRef.current
	const updateContent = React.useRef(handleContentChange);
	const contentRef = React.useRef(content);

	React.useEffect(() => {
		let contentToList = [];
		for (const content in checked) {
			if (checked[content]) contentToList.push(content);
		}
		if (!contentRef.current || !contentToList) return;
		if (contentToList.toString() === contentRef.current.toString())
			return updateContent.current(contentRef.current);
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

    const formatContent = () => {
        let contentString = "";
        if (!content || content.length === 0)
            return "Pick Content";
        for (let i = 0; i < content.length; i++) {
            let current = state.value.contents.find(
                (currentContent) => currentContent._id === content[i]
            );
            if (!current) return;
            if (i === content.length - 1)
                return (contentString += current.name);
            contentString += `${current.name}, `;
        }
        return contentString;
    };

	return (
		<div>
			<ListItem 
                style={{textAlign: "center"}}
                button 
                onClick={handleClickListItem}
            >
				<ListItemText primary={formatContent()} />
			</ListItem>
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
										onChange={(event) => handleChange(event)}
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
