import { Outlet } from "react-router";
import Banner from "../Components/Banner/Banner";
import Navbar from "../Components/Navbar/Navbar";

const Home = () => {

    return (
        <div className="flex">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Home;