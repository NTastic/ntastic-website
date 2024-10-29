"use client";
import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import Topbar from "@/modules/navigationLayout/topbar/Topbar";
import Sidebar from "@/modules/navigationLayout/sidebar/Sidebar";

const Main = styled('main')(({ theme }) => ({
    width: "100%",
    minWidth: 350,
    maxWidth: 800,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: 1,
    marginTop: '64px',
    marginBottom: '64px',
    overflowX: "hidden",
    backgroundColor: "#fff",
    borderRadius: "32px",
    boxShadow: "0px 16px 24px rgba(0, 0, 0, 0.1)",
    marginLeft: 60
}));

const NavigationLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `linear-gradient(45deg, rgba(153, 153, 255, 0.8), rgba(241, 90, 34, 0.5)), url(https://i.postimg.cc/c4HnDx6G/slogan.png)`,
                backgroundPositionY: "center, center",
                backgroundSize: "100%, 25%",
                backgroundRepeat: "no-repeat, repeat-x",
                backgroundAttachment: "fixed"
            }}
        >
            <Topbar />
            <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
            <Main>
                {children}
            </Main>
        </Box>
    );
};

export default NavigationLayout;