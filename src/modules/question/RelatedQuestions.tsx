"use client";
import React from "react";
import { Avatar, Box, Button, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { RelatedQuestionValue } from "@/shared/constants/types";
import ReactMarkdown from "react-markdown";
import { RouteConfig } from "@/routes/route";
import { useRouter } from "next/navigation";
import { SpinningHourglass } from "@/utils/Animations";

interface RelatedQuestionsProps {
    relatedQuestions: RelatedQuestionValue[];
    truncateContent: (content: string, wordLimit: number) => string;
    getMoreRelatedQuestions: () => void;
    isLoading: boolean;
};

const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({
    relatedQuestions, truncateContent, getMoreRelatedQuestions, isLoading
}) => {
    const router = useRouter();

    return (
        <Box width="100%">
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
                Related questions
            </Typography>
            <List
                sx={{
                    width: "100%"
                }}
            >
                {relatedQuestions.map((item: RelatedQuestionValue) => (
                    <ListItem
                        key={item.id}
                    >
                        <ListItemButton
                            onClick={() => {
                                router.push(`${RouteConfig.Community.Path}/${item.id}`);
                            }}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                mb: 2,
                                borderRadius: "16px",
                                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
                                transition: "all 0.5s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(80, 80, 200, 0.5)",
                                    transform: "scale(1.05)",
                                    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
                                }
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {item.title}
                            </Typography>
                            <Box display="flex">
                                <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                                <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                    {item.author.username}
                                </Typography>
                            </Box>
                            <ReactMarkdown>
                                {truncateContent(item.content, 50)}
                            </ReactMarkdown>
                            <Box display="flex" gap={2}>
                                <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                    {item.votes.upvotes} Agree
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                    {item.answers.items.length} Answers
                                </Typography>
                            </Box>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Button
                sx={{
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
                onClick={getMoreRelatedQuestions}
                disabled={isLoading}
            >
                {isLoading ? <SpinningHourglass/> : "More Related Questions"}
            </Button>
        </Box>
    );
};

export default RelatedQuestions;