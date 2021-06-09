import React from "react";
import FoodService from "services/FoodService";
import { Context } from "context/State";
import "./MakiTable.css";

const MakiTable = () => {
    const state = React.useContext(Context);
    const [makidata, setMakiData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        //init guard
        let isMounted = true;
        //import service component
        let { findByName } = FoodService();
        //let { refreshToken } = UserService();
        //create async function for getting data
        const find = async () => {
            let res = await findByName("maki");
            if (!isMounted) return;
            setMakiData(res.results);
            //cancel loading, so site can render
            setIsLoading(false);
        };
        //call function crated in useEffect
        find();
        //clean up function for when component gets unmounted mid call
        return () => {
            isMounted = false;
        };
    }, [state]);

    return (
        <div>
            {isLoading ? null : (
                <div className="maki-table">
                    <table>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Description</td>
                                <td>Price</td>
                            </tr>
                        </thead>
                        <tbody>
                            {makidata.map((maki) => <tr key={maki.name + maki.price}>
                                <td>{maki.name}</td>
                                <td>{maki.description}</td>
                                <td>{maki.price}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MakiTable;
