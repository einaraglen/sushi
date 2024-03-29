import React from "react";
import { Context } from "context/State";
import { Button } from "@material-ui/core";
import OrderService from "services/OrderService";
import ResponseHandler from "utils/ResponseHandler";
//import LinearProgress from '@material-ui/core/LinearProgress';

const OrderCard = ({ order }) => {
    const state = React.useContext(Context);
    const { handleResponse } = ResponseHandler();
    const startTime = new Date(order.created);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    //workaround to using context inside useEffect without infinity loop
    const effectVariables = React.useRef({
        wait: order.waitTime,
        startTime: startTime,
        currentTime: currentTime,
    });

    React.useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000)
        //remember to clear interval when component is no longer mounted
        effectVariables.current.startTime.setMinutes(effectVariables.current.startTime.getMinutes() + effectVariables.current.wait)
        let timeleft = effectVariables.current.startTime.getTime() - effectVariables.current.currentTime.getTime();
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        if (seconds <= 0) clearInterval(interval);
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

    const buildHeader = () => {
        startTime.setMinutes(startTime.getMinutes() + order.waitTime)
        let timeleft = startTime.getTime() - currentTime.getTime();
        //console.log(100 - (timeleft / 10000))
        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        let stringMinutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
        let stringSeconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;

        //if (minutes <= 0) return <p className={"time " + getUrgency(wait, minutes)}>No More Time</p>;
        return (
            <div className={`card-header ${getUrgency(seconds, minutes)}`}>
                <p className="info">{order.shortid}</p>
                <p className="info">{minutes <= 0 ? "Time is Out" : `${stringMinutes}:${stringSeconds}`}</p>
           </div>
        )
    };
    
    const getUrgency = (seconds, minutes) => {
        if (minutes <= 0 && seconds <= 0) return "done";

        let grade = order.waitTime / minutes;

        //when obove 65% of the way there
        if (grade < order.waitTime / Math.round(order.waitTime * 0.65)) return "start";
        //when obove 40% of the way there
        if (grade < order.waitTime / Math.round(order.waitTime * 0.40)) return "mid";
        //when rest of the way there
        if (grade <= order.waitTime) return "end"
    }

    return (
        <div className="order-card">
            {buildHeader()}
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
