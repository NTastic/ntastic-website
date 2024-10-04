"use client";
import { Box, styled } from '@mui/material';
import React, { PropsWithChildren } from 'react';

const Main = styled('main')(({ }) => ({
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    maxHeight: '100vh',
    padding: '4 0',
}));

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Box
            className="h-screen w-screen"
            sx={{
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    wheight: "100%",
                    backgroundImage: `url(/images/avstraliia-ozero-skala-northern-territory.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed"
                }}
            >
                <Main>
                    {children}
                </Main>
            </Box>
        </Box>
    );
};

export default AuthLayout;