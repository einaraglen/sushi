import React from "react";
import { Context } from "context/State";
import { Button } from "@material-ui/core";
import OrderService from "services/OrderService";
import ResponseHandler from "utils/ResponseHandler";

const OrderCard = ({ order }) => {
    const state = React.useContext(Context);
    const { handleResponse } = ResponseHandler();
    const startTime = new Date(order.created);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000)
        //remember to clear interval when component is no longer mounted
        return () => {
            clearInterval(interval);
        }
    }, []);

    const formatFoods = () => {
        let foodInstances = {};
        for (let i = 0; i < order.food.length; i++) {
            let instances = foodInstances[order.food[i]]
                ? foodInstances[order.food[i]]
                : 0;
            foodInstances = {
                ...foodInstances,
                [order.food[i]]: instances + 1,
            };
        }

        return Object.entries(foodInstances).map((foodInstance) => (
            <tr key={foodInstance[0]}>
                <td>
                    {
                        state.value.foods.find(
                            (food) => food._id === foodInstance[0]
                        ).number
                    }
                </td>
                <td>
                    {
                        state.value.foods.find(
                            (food) => food._id === foodInstance[0]
                        ).name
                    }
                </td>
                <td>{foodInstance[1]}</td>
            </tr>
        ));
    };

    const handleUpdateStatus = async () => {
        try {
            let { updateById } = OrderService();
            let res = await updateById(
                order._id,
                !order.done
                    ? {
                          done: true,
                      }
                    : {
                          active: false,
                      }
            );
            handleResponse(res, "orders", state.method.setOrders);
        } catch (error) {
            console.warn(error);
        }
    };

    const getTimeRemaining = () => {
        if (startTime.getHours() + 1 < currentTime.getHours()) return "Times Up!"
        let remainingMinute = (startTime.getMinutes() + 25 > 60 ? startTime.getMinutes() + 25 - 60 : startTime.getMinutes() + 25 ) - currentTime.getMinutes()
        let remainingSeconds = 59 - currentTime.getSeconds()
        return `${remainingMinute}:${remainingSeconds}`
    }

    return (
        <div className="order-card">
            <p>{order.shortid}</p>
            <p>{getTimeRemaining()}</p>
            <table>
                <tbody>{formatFoods()}</tbody>
            </table>
            <p>{`Total : ${order.price} kr`}</p>
            <Button
                onClick={handleUpdateStatus}
                color="primary"
                variant="contained"
                style={{ width: "6rem", margin: "auto" }}
            >
                {!order.done ? "Done" : "Complete"}
            </Button>
        </div>
    );
};

export default OrderCard;
