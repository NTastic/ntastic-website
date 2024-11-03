"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TAGS } from "@/graphql/qa";
import { TagValue } from "@/shared/constants/types";
import { Box, Button } from "@mui/material";
import { isSmallScreen } from "@/utils/IsSmallScreen";

const buttonStyle = (isSmall : boolean) => ({
    borderRadius: "32px",
    margin: 1,
    textTransform: "none",
    backgroundColor: "#d0d0d0",
    color: "#000",
    fontSize: isSmall ? "small" : "large",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "#3388cc",
        color: "#fff",
        transform: "scale(1.03) translateY(-3px)"
    }
});

const selectedButtonStyle = (isSmall : boolean) => ({
    borderRadius: "32px",
    margin: 1,
    textTransform: "none",
    backgroundColor: "#3388cc",
    color: "#fff",
    fontSize: isSmall ? "small" : "large",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "scale(1.03) translateY(-3px)"
    }
});

interface GetAllTagsProps {
    selectedTag: string;
    handleSelectTag: (id: string | null) => void;
};

const GetAllTags: React.FC<GetAllTagsProps> = ({
    selectedTag, handleSelectTag
}) => {
    const isSmall = isSmallScreen();
    const [tagList, setTagList] = useState<TagValue[]>([]);
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

    const isTagSelected = (tagId: string) => {
        return selectedTag === tagId;
    };

    useEffect(() => {
        if (tagData) {
            setTagList(tagData.getTags);
        }
    }, [tagData]);

    return (
        <Box
            sx={{
                width: "95%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mb: 1
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
                        sx={selectedTag !== "" ? buttonStyle(isSmall) : selectedButtonStyle(isSmall)}
                        onClick={() => handleSelectTag(null)}
                    >
                        All
                    </Button>
                )}
                {tagList.length > 0 && tagList.slice(0, 10).map((item: TagValue) => (
                    <Button
                        key={item.id}
                        variant="contained"
                        sx={isTagSelected(item.id) ? selectedButtonStyle(isSmall) : buttonStyle(isSmall)}
                        onClick={() => handleSelectTag(item.id)}
                    >
                        {item.name}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default GetAllTags;