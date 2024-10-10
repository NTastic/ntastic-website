"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';

const Recommendations: React.FC = () => {

    return (
        <Box
            sx={{
                width: "90%",
                minHeight: "300px",
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
            <Box width="100%" display="flex" flexDirection="row">
                <Typography variant="h6" fontWeight="bold">
                    Recommendations
                </Typography>
            </Box>
        </Box>
    );
};

export default Recommendations;