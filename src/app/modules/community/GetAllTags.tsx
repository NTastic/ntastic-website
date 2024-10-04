"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TAGS } from "@/graphql/qa";
import { Box, Button } from "@mui/material";

const buttonStyle = {
    borderRadius: "32px",
    margin: 1,
    textTransform: "none",
    backgroundColor: "#d0d0d0",
    color: "#000",
    fontSize: "large",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "#3388cc",
        color: "#fff",
        transform: "scale(1.03) translateY(-3px)"
    }
};

const selectedButtonStyle = {
    borderRadius: "32px",
    margin: 1,
    textTransform: "none",
    backgroundColor: "#3388cc",
    color: "#fff",
    fontSize: "large",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "scale(1.03) translateY(-3px)"
    }
};

type TagValue = {
    id: string;
    name: string;
    questionCount: number;
};

interface GetAllTagsProps {
    selectedTags: string[];
    handleSelectTags: (id: string | null, append: boolean) => void;
};

const GetAllTags: React.FC<GetAllTagsProps> = ({
    selectedTags, handleSelectTags
}) => {
    const { data: tagData } = useQuery(
        GET_TAGS,
        {
            variables: {
                sort: {
                    field: "questionCount",
                    order: "DESC"
                }
            },
            fetchPolicy: "no-cache"
        });
    const tagList = tagData?.getTags || [];

    const isTagSelected = (tagId: string) => {
        return selectedTags?.includes(tagId);
    };

    return (
        <Box
            sx={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 3
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap"
                }}
            >
                {tagList.length > 0 && (
                    <Button
                        variant="contained"
                        sx={selectedTags.length > 0 ? buttonStyle : selectedButtonStyle}
                        onClick={() => handleSelectTags(null, true)}
                    >
                        All
                    </Button>
                )}
                {tagList.length > 0 && tagList.map((item: TagValue) => (
                    <Button
                        key={item.id}
                        variant="contained"
                        sx={isTagSelected(item.id) ? selectedButtonStyle : buttonStyle}
                        onClick={() => handleSelectTags(item.id, isTagSelected(item.id) ? false : true)}
                    >
                        {item.name}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default GetAllTags;