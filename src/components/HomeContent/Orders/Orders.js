import React from "react";
import "./Orders.css";
import OrderService from "services/OrderService";
import FoodService from "services/FoodService";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import AddModal from "./AddModal";
import { Context } from "context/State";
import OrderCard from "./OrderCard";
import { CircularProgress } from "@material-ui/core/";
import UserService from "services/UserService";

const Orders = () => {
    const state = React.useContext(Context);
    const [openModal, setOpenModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    //workaround to using context inside useEffect without infinity loop
    const effectState = React.useRef(state);

    //get all orders
    React.useEffect(() => {
        //init guard
        let isMounted = true;
        //import service component
        let { findAllOrders, findAllArchives } = OrderService();
        let { findAllFoods } = FoodService();
        let { refreshToken, logout } = UserService();
        const find = async () => {
            //these we will display on screen, will not work unless token i active so refresh is needed
            let res_orders = await findAllOrders();
            let res_archives = await findAllArchives();
            if (!res_orders.status) {
                let refresh_res = await refreshToken();
                effectState.current.method.setValidUser(refresh_res.status);
                if (!refresh_res.status) return await logout();
                res_orders = await findAllOrders();
                res_archives = await findAllArchives();
            }
            //for manual add of order
            let res_foods = await findAllFoods();
            if (!isMounted) return;
            effectState.current.method.setOrders(res_orders.orders);
            effectState.current.method.setArchives(res_archives.archives);
            effectState.current.method.setFoods(res_foods.foods);
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

    const handleAddClick = () => {
        setOpenModal(true);
    };

    const handleData = (type) => {
        let temp = [];
        if (!state.value.orders) return;
        //gives all orders in-progress in FIFO order
        if (type === "in-progress") {
            temp = state.value.orders.filter((order) => !order.done);
            return temp.sort((a, b) => (a.created > b.created ? 1 : -1));
        }
        //gives all orders waiting for pickup in FIFO order
        if (type === "done") {
            temp = state.value.orders.filter(
                (order) => order.done && order.active
            );
            //temp = temp.sort((a, b) => (a === b ? 0 : a ? -1 : 1));
            return temp.sort((a, b) => (a.created > b.created ? 1 : -1));
        }
        //gives all in-active orders ranged from the last completed
        if (type === "complete") {
            temp = state.value.archives;
            return temp.sort((a, b) => (a.closed > b.closed ? -1 : 1));
        }
        return [];
    };

    return (
        <div className="orders">
            {isLoading ? (
                <div className="order-loading">
                    <CircularProgress
                        size="4rem"
                        style={{ padding: 0, marginTop: "15rem" }}
                    />
                </div>
            ) : (
                <div className="order-content">
                    <div className="orders-holder">
                        <div className="order-head">
                            {`In-Progress : ${
                                handleData("in-progress").length
                            }`}
                        </div>
                        {handleData("in-progress").map((order) => (
                            <OrderCard key={order.shortid} order={order} />
                        ))}
                    </div>
                    <div className="orders-holder">
                        <div className="order-head">
                            {`Done : ${handleData("done").length}`}
                        </div>
                        {handleData("done").map((order) => (
                            <OrderCard key={order.shortid} order={order} />
                        ))}
                    </div>
                </div>
            )}
            <IconButton
                onClick={handleAddClick}
                style={{ position: "fixed", bottom: "90px", right: "90px" }}
                color="primary"
            >
                <AddCircleIcon style={{ fontSize: "3.5rem" }} />
            </IconButton>
            <AddModal openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    );
};

export default Orders;
