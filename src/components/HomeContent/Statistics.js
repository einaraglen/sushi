import React from "react";
import UserService from "services/UserService";
import FoodService from "services/FoodService";
import OrderService from "services/OrderService";
import { Context } from "context/State";
import { CircularProgress } from "@material-ui/core/";
import { Bar } from "react-chartjs-2";

const Statistics = () => {
    const state = React.useContext(Context);
    const [isLoading, setIsLoading] = React.useState(true);
    const [foodFrequency, setFoodFrequency] = React.useState([]);

    //workaround to using context inside useEffect without infinity loop
    const effectState = React.useRef(state);

    //get all orders
    React.useEffect(() => {
        //init guard
        let isMounted = true;
        //import service component
        let { findAllArchives } = OrderService();
        let { findAllFoods } = FoodService();
        let { refreshToken, logout } = UserService();
        const find = async () => {
            //these we will display on screen, will not work unless token i active so refresh is needed
            let res_archives = await findAllArchives();
            if (!res_archives.status) {
                let refresh_res = await refreshToken();
                effectState.current.method.setValidUser(refresh_res.status);
                if (!refresh_res.status) return await logout();
                res_archives = await findAllArchives();
            }
            //for manual add of order
            let res_foods = await findAllFoods();
            if (!isMounted) return;
            effectState.current.method.setArchives(res_archives.archives);
            effectState.current.method.setFoods(res_foods.foods);
            buildData();
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

    const formatFood = (foods) => {
        let foodString = "";
        if (foods.length === 0) return "No Food Found";
        for (let i = 0; i < foods.length; i++) {
            let current = state.value.foods.find(
                (food) => food._id === foods[i]
            );
            if (!current) return;
            if (i === foods.length - 1) return (foodString += current.number);
            foodString += `${current.number}, `;
        }
        return foodString;
    };

    const buildData = () => {
        let tempData = [];
        for (let i = 0; i < state.value.archives.length; i++) {
            let current = state.value.archives[i];
            for (let j = 0; j < current.food.length; j++) {
                let currentFood = state.value.foods.find(
                    (food) => food._id === current.food[j]
                );
                let foodIndex = tempData.findIndex(
                    (food) => food.name === currentFood.name
                );
                if (foodIndex > -1) {
                    let tempArray = [...tempData];
                    tempArray[foodIndex] = {
                        ...tempArray[foodIndex],
                        value: tempArray[foodIndex].value + 1,
                    };
                    tempData = tempArray;
                }
                if (foodIndex === -1) {
                    tempData.push({
						name: currentFood.name,
						fullname: `${currentFood.number} ${currentFood.name}`,
                        value: 1,
                    });
                }
            }
        }
        setFoodFrequency(tempData.sort((a, b) => (a.value > b.value ? -1 : 1)));
    };

    return (
        <div className="stats">
            {isLoading ? (
                <div className="order-loading">
                    <CircularProgress
                        size="4rem"
                        style={{ padding: 0, marginTop: "15rem" }}
                    />
                </div>
            ) : (
                <div>
                    <div className="food-freq">
                        <Bar
                            style={{ height: "500px", width: "300px" }}
                            data={{
                                datasets: [
                                    {
                                        data: foodFrequency,
                                        backgroundColor: "hsl(128, 26%, 30%)", //y
                                        fill: true,
                                        barPercentage: 1,
                                        categoryPercentage: 0.7,
                                    },
                                ],
                            }}
                            options={{
								indexAxis: "y",
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    xAxes: [{ gridLines: { color: "green" } }],
                                    yAxes: [{ gridLines: { color: "red" } }],
                                },
                                parsing: {
                                    xAxisKey: "value",
                                    yAxisKey: "fullname",
                                },
                            }}
                            title="My amazing data"
                            color="#70CAD1"
                        />
                    </div>
                    <div className="archives">
                        <table>
                            <thead>
                                <tr>
                                    <td>Created</td>
                                    <td>Closed</td>
                                    <td>ID</td>
                                    <td>Food</td>
                                    <td>Price</td>
                                </tr>
                            </thead>
                            <tbody>
                                {state.value.archives.map((archive) => (
                                    <tr key={archive.shortid}>
                                        <td>
                                            {new Date(
                                                archive.created
                                            ).toLocaleString()}
                                        </td>
                                        <td>
                                            {new Date(
                                                archive.closed
                                            ).toLocaleString()}
                                        </td>
                                        <td>{archive.shortid}</td>
                                        <td>{formatFood(archive.food)}</td>
                                        <td>{archive.price} kr</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;
