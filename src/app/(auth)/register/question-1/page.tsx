import React from "react";
import { RouteConfig } from "@/routes/route";
import Question1 from "@/app/modules/register/Question-1";

export const metadata = RouteConfig.RegisterQuestion1.Metadata;

const RegisterQuestion1Page: React.FC = () => {
    return <Question1/>;
};

export default RegisterQuestion1Page;