"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    "/images/car-side-solid.svg",
    "/images/fish-solid.svg",
    "/images/football-solid.svg"
];

const AdsBoard: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const prevSlide = (): void => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };
    const nextSlide = (): void => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
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

    const handleMouseOver = (): void => {
        setIsHovered(true);
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
    };

    return (
        <Box
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            sx={{
                width: "90%",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: "16px",
                overflowX: "hidden",
                padding: 3,
                mt: 2,
                mb: 2
            }}
        >
            <Box width="100%">
                <img src={images[currentIndex]} style={{height: "100%", width: "auto"}}/>
            </Box>
            <Button
                onClick={prevSlide}
                sx={{
                    position: "relative",
                    left: 0,
                    top: "50%",
                }}
            >
                <ChevronLeft className="text-gray-400 group-hover:text-white" />
            </Button>
            <Button
                onClick={nextSlide}
                sx={{
                    position: "relative",
                    right: 0,
                    top: "50%",
                }}
            >
                <ChevronRight className="text-gray-400 group-hover:text-white" />
            </Button>
        </Box>
    );
};

export default AdsBoard;
