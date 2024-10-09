import { Box } from "@mui/material";
import React from "react";

const LoadingPage: React.FC = () => {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Box className="animate-spin rounded-full"/>
        </Box>
    );
};

export default LoadingPage;