"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from "lucide-react";
import CircleIcon from '@mui/icons-material/Circle';
import { isSmallScreen } from '@/utils/IsSmallScreen';

const ads = [
    {
        caption: "Claim your daily discount up to 30% now!",
        image: "/images/gift-solid.svg",
        bg: "#00FF9C"
    },
    {
        caption: "Top 10 Restaurants",
        image: "/images/utensils-solid.svg",
        bg: "#B6FFA1"
    },
    {
        caption: "Top 10 Groceries",
        image: "/images/cart-shopping-solid.svg",
        bg: "#FEFFA7"
    },
    {
        caption: "Top 10 Hotels",
        image: "/images/hotel-solid.svg",
        bg: "#FFE700"
    },
    {
        caption: "Top 10 Attractions",
        image: "/images/umbrella-beach-solid.svg",
        bg: "#E8B86D"
    },
];

const AdsBoard: React.FC = () => {
    const isSmall = isSmallScreen();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const prevSlide = (): void => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
    };

    const nextSlide = (): void => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    };

    const handleMouseOver = (): void => {
        setIsHovered(true);
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
    };

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [isHovered]);

    return (
        <Box
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            sx={{
                width: "100%",
                height: isSmall ? "200px" : "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                mt: 1,
            }}
        >
            <Button
                sx={{
                    width: "95%",
                    height: "70%",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: ads[currentIndex].bg,
                    transition: "all 0.5s ease",
                    transform: isHovered ? "scale(1.03)" : "none",
                    paddingLeft: isSmall ? 2 : 1,
                    paddingRight: isSmall ? 2 : 1,
                    marginLeft: isSmall ? 1 : 0,
                    marginRight: isSmall ? 1 : 0,
                    mt: isSmall ? 0 : 1,
                }}
            >
                <Typography
                    variant={isSmall ? "h6" : "body1"}
                    color="#000"
                    fontWeight="bold"
                    textAlign="start"
                    width="50%"
                    flexWrap="wrap"
                    ml={3}
                >
                    {ads[currentIndex].caption}
                </Typography>
                <img
                    src={ads[currentIndex].image}
                    style={{
                        height: isSmall ? "50%" : "70%",
                        width: "auto",
                        marginRight: 20
                    }}
                />
            </Button>
            <IconButton
                onClick={prevSlide}
                sx={{
                    position: "absolute",
                    left: 0,
                    top: "40%",
                    transform: "translateY(-40%)",
                    zIndex: 1,
                }}
            >
                <ChevronLeft />
            </IconButton>
            <IconButton
                onClick={nextSlide}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "40%",
                    transform: "translateY(-40%)",
                    zIndex: 1,
                }}
            >
                <ChevronRight />
            </IconButton>
            <Stack direction="row" spacing={1}>
                {ads.map((_, index) => (
                    <IconButton
                        key={index}
                        sx={{
                            transition: "all 0.5s ease",
                            "&:hover": {
                                transform: "translateY(-5px)"
                            }
                        }}
                        onClick={() => setCurrentIndex(index)}
                    >
                        <CircleIcon
                            sx={{
                                transition: "all 0.5s ease",
                                color: index === currentIndex ? "coral" : "#ccc",
                                fontSize: index === currentIndex ? (isSmall ? 15 : 25) : (isSmall ? 10 : 15),

                            }}
                        />
                    </IconButton>
                ))}
            </Stack>
        </Box>
    );
};

export default AdsBoard;
