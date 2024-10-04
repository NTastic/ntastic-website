import React from 'react';
import Login from '@/app/modules/login/Login';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Login.Metadata;

const LoginPage: React.FC = () => {
    return <Login/>;
};

export default LoginPage;