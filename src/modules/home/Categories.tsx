"use client";
import React, { useState } from 'react';
import { Box, Button, Typography, Collapse } from '@mui/material';
import Grid from "@mui/material/Grid2"
import GetCategoryIcon from '@/modules/home/GetCatIcon';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';

const categories = [
    {
        "id": "67256db36a861fb8b153a283",
        "name": "Restaurant"
    },
    {
        "id": "67256db36a861fb8b153a3d2",
        "name": "Shopping"
    },
    {
        "id": "67256db36a861fb8b153a2c2",
        "name": "Hotel"
    },
    {
        "id": "67256db36a861fb8b153a302",
        "name": "Attraction"
    }
];

const Categories: React.FC = () => {
    const router = useRouter();
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
                <Button onClick={handleCollapse} sx={{ textTransform: "none" }}>
                    {openCollapse ? "Show less" : "See all"}
                </Button>
            </Box>
            {categories.length > 0 && (
                <Box
                    width="100%"
                    padding={1}
                >
                    <Collapse in={openCollapse} collapsedSize={130} timeout={500}>
                        <Grid container spacing={2} columns={16}>
                            {categories.map((item) => (
                                <Grid size={4} key={item.id}>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            borderRadius: "16px",
                                            color: "black",
                                            textTransform: "none"
                                        }}
                                        onClick={() => {
                                            router.push(RouteConfig.Category(item.id, item.name).Path)
                                        }}
                                    >
                                        <GetCategoryIcon category={item.name} />
                                        <Typography>
                                            {item.name}
                                        </Typography>
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Collapse>
                </Box>
            )}
        </Box>
    );
};

export default Categories;