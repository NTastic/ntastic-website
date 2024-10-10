"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Stack, Typography, Collapse } from '@mui/material';

const Categories: React.FC = () => {
    const [openCollapse, setOpenCollapse] = useState<boolean>(false);

    const handleCollapse = () => setOpenCollapse(prev => !prev);

    return (
        <Box
            sx={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                padding: 3,
                mt: 2,
                mb: 2
            }}
        >
            <Box width="100%" display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                    Top Categories
                </Typography>
                <Button onClick={handleCollapse} sx={{textTransform: "none"}}>
                    {openCollapse ? "Show less" : "See all"}
                </Button>
            </Box>
        </Box>
    );
};

export default Categories;