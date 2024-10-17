"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, Typography } from "@mui/material";
import { RouteConfig } from "@/routes/route";
import { REG_LABELS_3 } from "@/shared/constants/storage";

const Question3: React.FC = () => {
    const router = useRouter();

    const labels = [
        "Chinese Food",
        "Asian Food",
        "Western Food",
        "Australian Local Cuisine",
        "Seafood",
        "Indian Food",
        "Fast Food & Street Food",
        "Cafes and Dessert"
    ];
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleClickOnLabel = (item: string) => {
        if (!selectedLabels.includes(item)) {
            setSelectedLabels((prevList) => [...prevList, item]);
        } else {
            setSelectedLabels((prevList) => prevList.filter(element => element !== item));
        }
    };

    const isLabelSelected = (item: string) => {
        return selectedLabels.includes(item);
    }

    const handleSubmit = () => {
        setSubmitStatus(null);
        setSubmitError(null);
        if (selectedLabels.length == 0) {
            setSubmitError("At least 1 label is required!");
            return;
        }
        localStorage.setItem(REG_LABELS_3, selectedLabels.join(";"));
        setSubmitStatus("You are all set!");
        setTimeout(() => {
            router.push(RouteConfig.Home.Path);
        }, 1000);
    };

    return (
        <Card
            sx={{
                width: "100%",
                minWidth: 350,
                maxWidth: 800,
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
                mr: 1,
                ml: 1
            }}
        >
            <Box
                sx={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    gap: 2,
                    padding: 2
                }}
            >
                <Typography
                    variant='h5'
                    sx={{
                        width: "100%",
                        fontWeight: "bold",
                        textAlign: "center",
                        mb: 3
                    }}>
                    Question3: What type of Cuisines do you prefer?
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexWrap: "wrap",
                        mb: 3,
                        gap: 2
                    }}
                >
                    {labels.map((item) => (
                        <Button
                            key={item}
                            sx={{
                                borderRadius: "16px",
                                backgroundColor: isLabelSelected(item) ? "orange" : "#ddd",
                                fontWeight: isLabelSelected(item) ? "bold" : "normal",
                                textTransform: "none",
                                color: "#000"
                            }}
                            onClick={() => handleClickOnLabel(item)}
                        >
                            {item}
                        </Button>
                    ))}
                </Box>
                <Button
                    variant="contained"
                    color="warning"
                    sx={{
                        width: "100%",
                        fontWeight: "bold",
                        borderRadius: "16px",
                    }}
                    onClick={() => handleSubmit()}
                >
                    Done
                </Button>
                {submitStatus && (
                    <Typography variant="body2" color="primary">
                        {submitStatus}
                    </Typography>
                )}
                {submitError && (
                    <Typography variant="body2" color="error">
                        {submitError}
                    </Typography>
                )}
            </Box>
        </Card>
    );
};

export default Question3;