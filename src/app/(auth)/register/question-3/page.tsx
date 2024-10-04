import React from "react";
import { RouteConfig } from "@/routes/route";
import Question3 from "@/app/modules/register/Question-3";

export const metadata = RouteConfig.RegisterQuestion3.Metadata;

const RegisterQuestion3Page: React.FC = () => {
    return <Question3/>;
};

export default RegisterQuestion3Page;