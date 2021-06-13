import React from "react";
import { TextField, Button } from "@material-ui/core";

const TypeRow = ({ type, state }) => {
    const [inEditMode, setInEditMode] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        pieces: 0
    });

    return(
        <tr>
            <td>
                {state === "add" ? "To be generated" : type._id}
            </td>
			<td>
				{!inEditMode ? (
					type.name
				) : (
					<TextField
						name="name"
						variant="filled"
						value={formData.name}
						size="small"
						type="number"
					/>
				)}
			</td>
			<td>
				<Button color="primary" variant="contained">
					{state === "add" ? "Add" : "Update"}
				</Button>
			</td>
		</tr>
    )
}

export default TypeRow;