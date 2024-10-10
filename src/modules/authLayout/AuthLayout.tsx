"use client";
import { Box, styled } from '@mui/material';
import React, { PropsWithChildren, useEffect, useState } from 'react';

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
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

    const fetchImageUrl = async (): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("url(https://i.postimg.cc/NGNy23DJ/avstraliia-ozero-skala-northern-territory.jpg)");
            }, 1000);
        });
    };

    const loadBackgroundImage = async () => {
        try {
            const imgUrl = await fetchImageUrl();
            setBackgroundImage(imgUrl);
        } catch (error) {
            console.error("Error loading background image:", error);
        }
    };

    useEffect(() => {
        loadBackgroundImage();
    }, []);

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
                    backgroundColor: "rgba(241, 90, 34, 0.5)",
                    backgroundImage: backgroundImage,
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