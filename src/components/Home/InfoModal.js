import React from "react";
import Modal from "react-modal";
import { Context } from "context/State";
import { Button } from "@material-ui/core";
import UserService from "services/UserService";

const InfoModal = () => {
    const state = React.useContext(Context);
    const { refreshToken, logout } = UserService();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClose = async (resolved) => {
        try {
            if (!resolved) await logout();
            state.method.setValidUser(resolved);
            state.method.setModalControlls({
                open: false,
                message: undefined,
            });
        } catch (error) {

        }
    };

    const handleTryResolve = async () => {
        setIsLoading(true);
        try {
            let res = await refreshToken();
            setIsLoading(false);
            handleClose(res.status);
            //give feedback with status from atempt
            state.method.setSnackControlls({ open: true, message: res.message });
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <Modal
            isOpen={state.value.modalControlls.open}
            onRequestClose={isLoading ? null : handleClose}
            shouldCloseOnOverlayClick={false}
            ariaHideApp={false}
            style={{
                content: {
                    display: "flex",
                    flexDirection: "column",
                    width: "20em",
                    height: "10em",
                    margin: "auto",
                    backgroundColor: "#E0E2DB",
                    border: "none",
                },
                overlay: {
                    overscrollBehavior: "contain",
                    //workaround: modal was not covering header
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.45)",
                },
            }}
        >
            <p className="modal-message">
                {state.value.modalControlls.message}
            </p>
            <div className="modal-buttons">
                <Button
                    disabled={isLoading}
                    onClick={handleTryResolve}
                    style={{ width: "7rem", margin: "auto" }}
                    color="primary"
                    variant="contained"
                >
                    Resolve
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={() => handleClose(false)}
                    style={{ width: "7rem", margin: "auto" }}
                    color="default"
                    variant="contained"
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default InfoModal;
