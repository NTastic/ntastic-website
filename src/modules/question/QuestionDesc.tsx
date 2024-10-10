"use client";
import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { QuestionValue, AnswerValue } from "@/shared/constants/types";
import DisplayImages from "@/utils/DisplayImages";

interface QuestionDescProps {
    question: QuestionValue;
    answers: AnswerValue[];
    handleVoteQuestion: () => void;
};

const QuestionDesc: React.FC<QuestionDescProps> = ({question, answers, handleVoteQuestion}) => {
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {question.title}
            </Typography>
            <Box display="flex">
                <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                    {question.author.username}
                </Typography>
            </Box>
            <Typography variant="body1">
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
    );
};

export default QuestionDesc;