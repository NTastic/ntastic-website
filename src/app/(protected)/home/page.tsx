import React from "react";
import { RouteConfig } from "@/routes/route";
import Home from "@/modules/home/Home";

export const metadata = RouteConfig.Home.Metadata;

const HomePage: React.FC = () => {
    return <Home/>;
};

export default HomePage;