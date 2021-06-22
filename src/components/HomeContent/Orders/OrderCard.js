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

    const buildHeader = (wait) => {
        startTime.setMinutes(startTime.getMinutes() + wait)
        let timeleft = startTime.getTime() - currentTime.getTime();
        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        let stringMinutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
        let stringSeconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;

        //if (minutes <= 0) return <p className={"time " + getUrgency(wait, minutes)}>No More Time</p>;
        return (
            <div className={`card-header ${getUrgency(wait, minutes)}`}>
                <p className="info">{order.shortid}</p>
                <p className="info">{minutes <= 0 ? "Time is Out" : `${stringMinutes}:${stringSeconds}`}</p>
            </div>
        )
    }

    const getUrgency = (wait, minutes) => {
        if (minutes <= 0) return "done";

        let grade = wait / minutes;

        if (grade < wait / 10) return "start";
        if (grade < wait / 6) return "mid";
        if (grade <= wait) return "end"
    }

    return (
        <div className="order-card">
            {buildHeader(15)}
            <table>
                <tbody>{formatFoods()}</tbody>
            </table>
            <p>{`Total : ${order.price} kr`}</p>
            <Button
                onClick={handleUpdateStatus}
                color="primary"
                variant="contained"
                style={{ maxWidth: "6rem", margin: "auto" }}
            >
                {!order.done ? "Done" : "Complete"}
            </Button>
        </div>
    );
};

export default OrderCard;
