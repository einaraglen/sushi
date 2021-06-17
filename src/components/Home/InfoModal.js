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
                actionText: undefined,
			    delete: false,
            });
        } catch (error) {
            state.method.setValidUser(false);
            alert(error);
        }
    };

    const handleDeleteClose = () => {
        state.method.setConfirmDelete(false);
        state.method.setModalControlls({
            open: false,
            message: undefined,
            actionText: undefined,
            delete: false,
        });
    }

    const handleTryResolve = async () => {
        setIsLoading(true);
        try {
            let res = await refreshToken();
            setIsLoading(false);
            handleClose(res.status);
            //give feedback with status from atempt
            state.method.setSnackControlls({
                open: true,
                message: res.message,
                actionText: undefined,
                delete: false,
            });
        } catch (error) {
            console.warn(error);
        }
    };

    const handleDeleteConfirmed = () => {
        state.method.setConfirmDelete(true);
        state.method.setModalControlls({
            open: false,
            message: undefined,
            actionText: undefined,
            delete: false,
        });        
    }

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
                    onClick={() => state.value.modalControlls.delete ? handleDeleteClose() : handleClose(false)}
                    style={{ width: "7rem", margin: "auto" }}
                    color="default"
                    variant="contained"
                >
                    Cancel
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={ state.value.modalControlls.delete ? handleDeleteConfirmed : handleTryResolve}
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
