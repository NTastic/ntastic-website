import React from "react";
import { RouteConfig } from "@/routes/route";
import Question2 from "@/app/modules/register/Question-2";

export const metadata = RouteConfig.RegisterQuestion2.Metadata;

const RegisterQuestion2Page: React.FC = () => {
    return <Question2/>;
};

export default RegisterQuestion2Page;