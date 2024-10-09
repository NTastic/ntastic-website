import React from 'react';
import Register from '@/modules/register/Register';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Register.Metadata;

const RegisterPage: React.FC = () => {
    return <Register/>;
};

export default RegisterPage;