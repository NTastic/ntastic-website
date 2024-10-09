"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Box, List, ListItem, ListItemButton, Typography } from "@mui/material"
import { useQuery } from "@apollo/client";
import { GET_QUESTIONS } from "@/graphql/qa";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";
import DisplayImages from "./DisplayImages";

interface NewQuestionsProps {
    selectedTag: string;
};

type QuestionValue = {
    id: string;
    author: {
        id: string,
        username: string
    };
    title: string;
    content: string;
    tags: Array<{
        id: string,
        name: string,
    }>;
    images: Array<string>;
    answers: {
        items: Array<{
            id: string
        }>
    };
    votes: {
        upvotes: number,
        downvotes: number
    };
};

const NewQuestions: React.FC<NewQuestionsProps> = ({ selectedTag }) => {
    const router = useRouter();
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [questions, setQuestions] = useState<QuestionValue[]>([]);

    const { data: questionData } = useQuery(
        GET_QUESTIONS,
        {
            variables: {
                tagIds: tagIds,
                pageOptions: {
                    limit: 10,
                    sortField: "updatedAt",
                    order: "DESC"
                }
            },
            fetchPolicy: "no-cache"
        }
    );

    const truncateContent = (content: string, wordLimit: number = 50) => {
        const words = content.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + " ...";
        }
        return content;
    }

    useEffect(() => {
        if (selectedTag === "") {
            setTagIds([]);
        } else {
            setTagIds([selectedTag]);
        }
    }, [selectedTag]);

    useEffect(() => {
        if (questionData) {
            setQuestions(questionData?.getQuestions.items || [])
        }
    }, [selectedTag, questionData]);

    return (
        <Box
            sx={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                padding: 3
            }}
        >
            <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
                The newest asked questions:
            </Typography>
            <List
                sx={{
                    width: "100%"
                }}
            >
                {questions.map((item: QuestionValue) => (
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
                            <Typography variant="body1">
                                {truncateContent(item.content)}
                            </Typography>
                            {item.images.length > 0 && (
                                <Box mb={1} mt={1}>
                                    <DisplayImages images={item.images} height={150} />
                                </Box>
                            )}
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
        </Box>
    );
};

export default NewQuestions;