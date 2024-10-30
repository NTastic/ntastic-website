"use client";
import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';
import { truncateContent } from '@/utils/TruncateContent';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import { SpinningHourglass } from '@/utils/Animations';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GET_RECOMMENDATIONS } from '@/graphql/poi';
import { useQuery } from '@apollo/client';
import { RecommendationValue } from '@/shared/constants/types';
import StarIcon from '@mui/icons-material/Star';

const Recommendations: React.FC = () => {
    const router = useRouter();
    const [recList, setRecList] = useState<RecommendationValue[]>([]);
    const [recPage, setRecPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: recData, refetch } = useQuery(
        GET_RECOMMENDATIONS,
        {
            variables: {
                catIds: [
                    "6711feb037c20e220b1c00df",
                    "6711feb037c20e220b1c021f",
                    "6711feb037c20e220b1c0100",
                    "6711feb037c20e220b1c00d0"
                ],
                "pageOptions": {
                    limit: 12,
                    page: recPage,
                }
            },
            fetchPolicy: "no-cache"
        }
    );

    const handleMoreRecs = () => {
        setIsLoading(true);
        setRecPage(prev => prev + 1);
        refetch().then(() => setIsLoading(false));
    };

    useEffect(() => {
        if (recData) {
            setRecList((prev) => {
                return [...prev, ...recData.getRecommendations.items];
            });
        }
    }, [recData]);

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
            <Box width="100%" display="flex" flexDirection="column">
                <Typography variant="h6" fontWeight="bold">
                    Recommendations
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        borderRadius: "16px"
                    }}

                >
                    <ImageList variant="masonry" cols={3} gap={8} sx={{ width: "95%" }}>
                        {recList.map((item) => (
                            <ImageListItem key={item.id}>
                                <Button
                                    sx={{
                                        borderRadius: "16px",
                                        textTransform: "none",
                                        color: "black",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: 1,
                                        transition: "all 0.5s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
                                        }
                                    }}
                                    onClick={() => {
                                        router.push(
                                            RouteConfig.Recommendation(
                                                item.catIds[0], 
                                                item.list[0].poi.id, 
                                                item.id
                                            ).Path
                                        )
                                    }}
                                >
                                    <img
                                        src={item.list[0].poi.photoUrls[0]}
                                        loading="lazy"
                                        style={{ width: "100%", height: "auto", borderRadius: "16px" }}
                                    />
                                    <Typography width="95%" variant="body2" textAlign="start">
                                        {truncateContent(item.title, 20)}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        width="100%"
                                    >
                                        <StarIcon
                                            sx={{
                                                mr: 0.5,
                                                color: "rgba(255, 0, 0, 0.5)"
                                            }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            {item.list[0].poi.rating}
                                        </Typography>
                                    </Box>
                                </Button>
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <IconButton
                        color="primary"
                        onClick={handleMoreRecs}
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <ExpandMoreIcon />
                        <Typography>More</Typography>
                    </IconButton>
                    {isLoading && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                position: "relative",
                                bottom: 0
                            }}
                        >
                            <SpinningHourglass />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Recommendations;