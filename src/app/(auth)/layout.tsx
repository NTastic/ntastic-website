import React, { PropsWithChildren } from "react";
import AuthLayout from "@/app/modules/authLayout/AuthLayout";

const AuthLayoutPage: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
};

export default AuthLayoutPage;