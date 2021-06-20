import React from "react";
import { Context } from "context/State";

const OrderCard = ({ order }) => {
    const state = React.useContext(Context);

    const formatFoods = () => {
        let foodInstances = {};
        for (let i = 0; i < order.food.length; i++) {
            let instances = foodInstances[order.food[i]] ? foodInstances[order.food[i]] : 0;
		    foodInstances = {
                ...foodInstances,
                [order.food[i]]: instances + 1,
            }
        }

        return Object.entries(foodInstances).map((foodInstance) => 
            <tr key={foodInstance[0]}>
                <td>{state.value.foods.find((food) => food._id === foodInstance[0]).number}</td>
                <td>{state.value.foods.find((food) => food._id === foodInstance[0]).name}</td>
                <td>{foodInstance[1]}</td>
            </tr>
        );
    }

    formatFoods();

    return (
        <div className="order-card">
            <p>{order.shortid}</p>
            <p>{order.created}</p>
            <table>
                <tbody>
                    {formatFoods()}
                </tbody>
            </table>
            <p>{`Total : ${order.price}`}</p>
        </div>
    )
}

export default OrderCard;