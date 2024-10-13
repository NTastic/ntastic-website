"use client";
import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, IconButton, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import { truncateContent } from '@/utils/TruncateContent';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';

const test_pois = [
    {
        id: 0,
        author: "James",
        comments: ["The food is absolutely delicious!"],
        photoUrls: ["https://picsum.photos/200/300"],
        votes: { upvotes: 6 }
    },
    {
        id: 1,
        author: "James",
        comments: ["The staff is so friendly and attentive!"],
        photoUrls: ["https://picsum.photos/300/400"],
        votes: { upvotes: 6 }
    },
    {
        id: 2,
        author: "James",
        comments: ["The ambiance is perfect for a relaxing meal."],
        photoUrls: ["https://picsum.photos/150/200"],
        votes: { upvotes: 6 }
    },
    {
        id: 3,
        author: "James",
        comments: ["The presentation of the dishes is amazing!"],
        photoUrls: ["https://picsum.photos/500/800"],
        votes: { upvotes: 6 }
    },
    {
        id: 4,
        author: "James",
        comments: ["I love the variety on the menu!"],
        photoUrls: ["https://picsum.photos/400/400"],
        votes: { upvotes: 6 }
    },
    {
        id: 5,
        author: "James",
        comments: ["The portion sizes are just right!"],
        photoUrls: ["https://picsum.photos/200/300"],
        votes: { upvotes: 6 }
    },
    {
        id: 6,
        author: "James",
        comments: ["Everything tastes so fresh and flavorful!"],
        photoUrls: ["https://picsum.photos/500/300"],
        votes: { upvotes: 6 }
    },
    {
        id: 7,
        author: "James",
        comments: ["The drinks are perfectly made!"],
        photoUrls: ["https://picsum.photos/200/400"],
        votes: { upvotes: 6 }
    },
    {
        id: 8,
        author: "James",
        comments: ["The dessert here is a must-try!"],
        photoUrls: ["https://picsum.photos/450/320"],
        votes: { upvotes: 6 }
    },
    {
        id: 9,
        author: "James",
        comments: ["I can’t wait to come back!"],
        photoUrls: ["https://picsum.photos/400/300"],
        votes: { upvotes: 6 }
    },
];

const Recommendations: React.FC = () => {
    const router = useRouter();

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
                <ImageList variant="masonry" cols={3} gap={8}>
                    {test_pois.map((item) => (
                        <ImageListItem key={item.id}>
                            <Button
                                sx={{
                                    textTransform: "none",
                                    color: "black",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: 1,
                                    transition: "all 0.5s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)"
                                    }
                                }}
                                onClick={() => {
                                    router.push(RouteConfig.Recommendation("restaurant", "001", "001").Path)
                                }}
                            >
                                <img
                                    srcSet={`${item.photoUrls[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.photoUrls[0]}?w=248&fit=crop&auto=format`}
                                    loading="lazy"
                                    style={{ width: "100%", height: "auto" }}
                                />
                                <Typography variant="body1" textAlign="start" fontWeight="bold">
                                    {truncateContent(item.comments[0], 20)}
                                </Typography>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                    width="100%"
                                >
                                    <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary" flexGrow={1} textAlign="start">
                                        {item.author}
                                    </Typography>
                                    <FavoriteBorderIcon
                                        sx={{
                                            mr: 0.5,
                                            color: "rgba(255, 0, 0, 0.5)"
                                        }}
                                    />
                                    <Typography variant="body2" color="textSecondary">
                                        {item.votes.upvotes}
                                    </Typography>
                                </Box>
                            </Button>
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Box>
    );
};

export default Recommendations;