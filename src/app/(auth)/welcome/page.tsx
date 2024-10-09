import React from "react";
import { RouteConfig } from "@/routes/route";
import Welcome from "@/modules/welcome/Welcome";

export const metadata = RouteConfig.Welcome.Metadata;

const WelcomePage: React.FC = () => {
    return <Welcome/>
};

export default WelcomePage;