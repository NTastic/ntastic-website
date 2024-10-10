"use client"
import React from "react";
import { Box } from "@mui/material";
import AdsBoard from "@/modules/home/AdsBoard";
import Categories from "@/modules/home/Categories";
import Recommendations from "@/modules/home/Recommendations";

const Home: React.FC = () => {
    return (
        <Box
            sx={{
                width: "95%",
                minWidth: 350,
                maxWidth: 800,
                display: "flex",
                flexDirection: "column",
                padding: 1,
                margin: { xs: 1, md: 0 },
                alignItems: "center",
                justifyContent: "space-around"
            }}
        >
            <AdsBoard />
            <Categories />
            <Recommendations />
        </Box>
    );
};

export default Home;