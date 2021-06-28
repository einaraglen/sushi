import React from "react";
import Modal from "react-modal";
import { Context } from "context/State";
import { Button } from "@material-ui/core";
import UserService from "services/UserService";

const InfoModal = () => {
	const state = React.useContext(Context);
	const { validateToken, logout } = UserService();

	//document.body.style.overflow = 'hidden';

	React.useEffect(() => {
		document.body.style.overflow = state.value.modalControlls.open ? 'hidden' : 'unset';
		document.body.style.paddingRight = state.value.modalControlls.open ? '17px' : '0px';
	}, [state.value.modalControlls])


	const close = async () => {
		if (state.value.modalControlls.actionText === "Yes") return state.method.closeModal();
		try {
			let res = await validateToken();
			if (!res.status) await logout();
			state.method.setValidUser(res.status);
		} catch (error) {
			console.warn(error);
		}
		state.method.closeModal();
	};

	return (
		<Modal
			isOpen={state.value.modalControlls.open}
			shouldCloseOnOverlayClick={false}
			ariaHideApp={false}
			style={{
				content: {
					display: "flex",
					flexDirection: "column",
					width: "18rem",
					height: "8rem",
					margin: "auto",
					backgroundColor: "hsl(0, 0%, 25%)",
					border: "none",
				},
				overlay: {
					overscrollBehavior: "contain",
					//workaround: modal was not covering header
					zIndex: 10,
					backgroundColor: "rgba(0, 0, 0, 0.2)",
				},
			}}
		>
			<p className="modal-message">{state.value.modalControlls.message}</p>
			<div className="modal-buttons">
				<Button
					onClick={close}
					style={{ width: "7rem", margin: "auto" }}
					color="default"
					variant="outlined"
				>
					Cancel
				</Button>
				<Button
					onClick={async () => state.value.modalControlls.function()}
					style={{ width: "7rem", margin: "auto" }}
					color="primary"
					variant="contained"
				>
					{state.value.modalControlls.actionText}
				</Button>
			</div>
		</Modal>
	);
};

export default InfoModal;
