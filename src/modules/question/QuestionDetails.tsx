"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_QUESTION, GET_ANSWERS, GET_QUESTIONS, VOTE } from "@/graphql/qa";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import IosShareIcon from '@mui/icons-material/IosShare';
import { ACCESS_TOKEN, SELECTED_TAG } from "@/shared/constants/storage";
import { RouteConfig } from "@/routes/route";
import { QuestionValue, AnswerValue, RelatedQuestionValue } from "@/shared/constants/types";
import AnswerList from "@/modules/question/AnswerList";
import QuestionDesc from "@/modules/question/QuestionDesc";
import RelatedQuestions from "@/modules/question/RelatedQuestions";
import PostAnAnswer from "@/modules/question/PostAnAnswer";
import { handleShare } from "@/utils/HandleShare";
import { truncateContent } from "@/utils/TruncateContent";
import { isSmallScreen } from "@/utils/IsSmallScreen";

const QuestionDetails: React.FC<{ params: { id: string } }> = ({ params }) => {
    const router = useRouter();
    const isSmall = isSmallScreen();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const tagIds = typeof window !== "undefined" ? [localStorage.getItem(SELECTED_TAG)] : [];
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [question, setQuestion] = useState<QuestionValue | null>(null);
    const [answers, setAnswers] = useState<AnswerValue[]>([]);
    const [answerLimit, setAnswerLimit] = useState<number>(30);
    const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestionValue[]>([]);
    const [relatedQuestionsLimit, setRelatedQuestionsLimit] = useState<number>(10);
    const [openAnswerDialog, setOpenAnswerDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [vote] = useMutation(VOTE);
    const { data: questionData, refetch: refetchQuestion } = useQuery(
        GET_QUESTION,
        { variables: { getQuestionId: params.id } }
    );
    const { data: answerData, refetch: refetchAnswer } = useQuery(
        GET_ANSWERS,
        {
            variables: {
                questionId: params.id,
                pageOptions: {
                    limit: answerLimit,
                    page: 1,
                    sortOpts: [
                        {
                            field: "votes.upvotes",
                            order: "DESC",
                        }
                    ]
                }
            },
            skip: !question
        }
    );
    const { data: relatedData, refetch: refetchRelatedData } = useQuery(
        GET_QUESTIONS,
        {
            variables: {
                tagIds: tagIds && tagIds[0] && tagIds[0].length > 0 ? tagIds : [],
                pageOptions: {
                    limit: relatedQuestionsLimit,
                    sortOpts: [
                        {
                            field: "updatedAt",
                            order: "DESC"
                        }
                    ]
                }
            },
            skip: !question
        }
    );

    const getMoreAnswers = () => {
        setAnswerLimit(prev => prev + 30);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        refetchAnswer();
    };

    const getMoreRelatedQuestions = () => {
        setRelatedQuestionsLimit(prev => prev + 10);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        refetchRelatedData();
    };

    const handleVoteQuestion = async () => {
        try {
            let resp = await vote({
                variables: {
                    targetId: params.id,
                    targetType: "Question",
                    voteType: "upvote"
                }
            });

            if (resp.data && !resp.data.vote.success) {
                resp = await vote({
                    variables: {
                        targetId: params.id,
                        targetType: "Question",
                        voteType: "cancel"
                    }
                });
            }
        } catch (err) {
            console.log(`Vote Error: ${(err as Error).message}`);
        } finally {
            refetchQuestion();
        }
    };

    const handleVoteAnswer = async (answerId: string, voteType: string) => {
        try {
            let resp = await vote({
                variables: {
                    targetId: answerId,
                    targetType: "Answer",
                    voteType: voteType
                }
            });

            if (resp.data && !resp.data.vote.success) {
                resp = await vote({
                    variables: {
                        targetId: answerId,
                        targetType: "Answer",
                        voteType: "cancel"
                    }
                });
            }
        } catch (err) {
            console.log(`Vote Error: ${(err as Error).message}`);
        } finally {
            refetchAnswer();
        }
    };

    const handleOpenAnswerDialog = () => setOpenAnswerDialog(true);

    const handleCloseAnswerDialog = () => setOpenAnswerDialog(false);

    useEffect(() => {
        const accessToken = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;
        setAccessToken(accessToken);
    }, []);

    useEffect(() => {
        setIsAuth(!!accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (questionData) {
            setQuestion(questionData?.getQuestion);
        }
    }, [questionData]);

    useEffect(() => {
        if (answerData) {
            setAnswers(answerData.getAnswers.items);
        }
    }, [answerData]);

    useEffect(() => {
        if (relatedData) {
            const filteredQuestions = relatedData?.getQuestions.items.filter(
                (item: RelatedQuestionValue) => item.id !== params.id
            ) || [];
            setRelatedQuestions(filteredQuestions);
        }
    }, [relatedData])

    return (
        <Box
            sx={{
                width: "95%",
                minWidth: 350,
                maxWidth: 800,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 1
            }}
        >
            <Box
                width="100%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                mb={isSmall ? 1 : 2}
            >
                <IconButton
                    size='large'
                    edge='start'
                    onClick={() => { router.push(RouteConfig.Community.Path) }}
                    sx={{ mr: 1 }}
                >
                    <ChevronLeftIcon />
                </IconButton>
                <Typography
                    variant={isSmall ? "h6" : "h5"}
                    sx={{ flexGrow: 1, fontWeight: "bold" }}
                >
                    Community
                </Typography>
                <Button
                    sx={{
                        fontSize: "large",
                        fontWeight: "bold",
                        color: "orange",
                        textTransform: "none",
                        borderRadius: "16px",
                        transition: "all 0.5s ease",
                        "&:hover": {
                            transform: "scale(1.05)",
                            backgroundColor: "rgba(30, 80, 255, 0.5)"
                        }
                    }}
                    onClick={() => { router.push(isAuth ? RouteConfig.PostAQuestion.Path : RouteConfig.Login.Path) }}
                >
                    Ask
                </Button>
                <IconButton onClick={handleShare} color="primary">
                    <IosShareIcon />
                </IconButton>
            </Box>
            {/* Question Description */}
            {question && (
                <QuestionDesc
                    question={question}
                    answers={answers}
                    handleVoteQuestion={handleVoteQuestion}
                />
            )}
            <Divider sx={{ width: "100%", marginTop: 2, marginBottom: 2 }} />
            {/* Answers */}
            {answers.length > 0 && (
                <AnswerList
                    answers={answers}
                    handleVoteAnswer={handleVoteAnswer}
                    getMoreAnswers={getMoreAnswers}
                    isLoading={isLoading}
                />
            )}
            <Divider sx={{ width: "100%", marginTop: 2, marginBottom: 2 }} />
            {/* Related questions */}
            {relatedQuestions.length > 0 && (
                <RelatedQuestions
                    relatedQuestions={relatedQuestions}
                    truncateContent={truncateContent}
                    getMoreRelatedQuestions={getMoreRelatedQuestions}
                    isLoading={isLoading}
                />
            )}
            <Button
                variant="contained"
                color="secondary"
                sx={{
                    width: "60%",
                    borderRadius: "16px",
                    position: "fixed",
                    bottom: 10,
                    left: "calc(50% + 25px)",
                    transform: "translateX(-50%)",
                    fontSize: isSmall ? "small" : "medium"
                }}
                onClick={handleOpenAnswerDialog}
            >
                I have an answer for this ...
            </Button>
            <PostAnAnswer
                open={openAnswerDialog}
                questionId={params.id}
                handleCloseAnswerDialog={handleCloseAnswerDialog}
                refetchAnswer={refetchAnswer}
            />
        </Box>
    );
};

export default QuestionDetails;