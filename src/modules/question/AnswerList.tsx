"use client";
import React from "react";
import { Avatar, Box, Button, Divider, List, ListItem, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import DisplayImages from "@/utils/DisplayImages";
import { AnswerValue } from "@/shared/constants/types";
import { SpinningHourglass } from "@/utils/Animations";

interface AnswerListProps {
    answers: AnswerValue[];
    handleVoteAnswer: (answerId: string, voteType: string) => void;
    getMoreAnswers: () => void;
    isLoading: boolean;
};

const AnswerList: React.FC<AnswerListProps> = ({
    answers, handleVoteAnswer, getMoreAnswers, isLoading
}) => {
    return (
        <Box width="95%">
            <List>
                {answers && answers.map((item: AnswerValue) => (
                    <ListItem
                        key={item.id}
                        sx={{
                            width: "100%", 
                            padding: 0, 
                            margin: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            mb: 1,
                            gap: 1
                        }}
                    >
                        <Box 
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        >
                            <Avatar 
                            src={item.author.avatar || "none"}
                            sx={{ width: "20px", height: "20px", mr: 1 }} 
                            />
                            <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                {item.author.username}
                            </Typography>
                        </Box>
                        <Box>
                            <ReactMarkdown>
                                {item.content}
                            </ReactMarkdown>
                        </Box>
                        {item.images.length > 0 && (
                            <Box 
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            mt={1}
                            mb={1}>
                                <DisplayImages images={item.images} height={300} />
                            </Box>
                        )}
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{
                                    height: "30px",
                                    borderRadius: "12px",
                                    textTransform: "none"
                                }}
                                onClick={() => handleVoteAnswer(item.id, "upvote")}
                            >
                                Agree  {item.votes.upvotes}
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                sx={{
                                    height: "30px",
                                    borderRadius: "12px",
                                    textTransform: "none"
                                }}
                                onClick={() => handleVoteAnswer(item.id, "downvote")}
                            >
                                Disagree  {item.votes.downvotes}
                            </Button>
                        </Box>
                        <Divider sx={{ width: "100%", mt: 1, mb: 1 }} />
                    </ListItem>
                ))}
            </List>
            <Button
                sx={{
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
                onClick={getMoreAnswers}
                disabled={isLoading}
            >
                {isLoading ? <SpinningHourglass /> : "More Answers"}
            </Button>
        </Box>
    );
};

export default AnswerList;