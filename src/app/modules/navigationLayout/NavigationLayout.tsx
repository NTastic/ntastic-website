"use client";
import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import Topbar from "@/app/modules/navigationLayout/topbar/Topbar";
import Sidebar from "@/app/modules/navigationLayout/sidebar/Sidebar";

const Main = styled('main')(({ }) => ({
    width: "100%",
    minWidth: 350,
    maxWidth: 800,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    maxHeight: '100vh',
    padding: 1,
    marginTop: '64px',
    overflowX: "hidden",
    backgroundColor: "#fff",
    borderRadius: "32px",
    boxShadow: "0px 16px 24px rgba(0, 0, 0, 0.1)",
}));

const NavigationLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const [degree, setDegree] = useState<number>(45);
    useEffect(() => {
        const invertalId = setInterval(() => {
            setDegree((prevDegree) => (prevDegree + 1) % 360);
        }, 100);
        return () => clearInterval(invertalId);
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `linear-gradient(${degree}deg, rgba(153, 153, 255, 0.8), rgba(241, 90, 34, 0.5)), url(/images/slogan.png)`,
                backgroundPositionY: "center, center",
                backgroundSize: "100%, 25%",
                backgroundRepeat: "no-repeat, repeat-x",
                backgroundAttachment: "fixed"
            }}
        >
            <Topbar handleDrawerOpen={handleDrawerOpen} />
            <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
            <Main>
                {children}
            </Main>
        </Box>
    );
};

export default NavigationLayout;