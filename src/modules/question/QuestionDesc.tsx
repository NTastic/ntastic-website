"use client";
import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { QuestionValue, AnswerValue } from "@/shared/constants/types";
import DisplayImages from "@/utils/DisplayImages";
import { isSmallScreen } from "@/utils/IsSmallScreen";

interface QuestionDescProps {
    question: QuestionValue;
    answers: AnswerValue[];
    handleVoteQuestion: () => void;
};

const QuestionDesc: React.FC<QuestionDescProps> = ({ question, answers, handleVoteQuestion }) => {
    const isSmall = isSmallScreen();

    return (
        <Box
            sx={{
                width: "95%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                mb: 1
            }}
        >
            <Box
                width="100%"
                display="flex"
                flexDirection="column"
                gap={isSmall ? 1 : 2}
            >
                <Typography 
                variant={isSmall ? "h5" : "h4"}
                sx={{ fontWeight: "bold" }}
                >
                    {question.title}
                </Typography>
                <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                    <Avatar 
                    src={question.author.avatar || "none"}
                    sx={{ width: "20px", height: "20px", mr: 1 }} 
                    />
                    <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                        {question.author.username}
                    </Typography>
                </Box>
                <Typography variant="h5" mb={1}>
                    {question.content}
                </Typography>
                {question.images.length > 0 && (
                    <Box mb={2}>
                        <DisplayImages images={question.images} height={300} />
                    </Box>
                )}
                <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                    <Button
                        variant="contained"
                        color="info"
                        sx={{
                            textTransform: "none",
                            borderRadius: "12px"
                        }}
                        onClick={() => handleVoteQuestion()}
                    >
                        Helpful {question.votes.upvotes}
                    </Button>
                    <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                        {answers.length} Answers
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default QuestionDesc;