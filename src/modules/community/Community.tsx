"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AskQuestions from "@/modules/community/AskQuestions";
import GetAllTags from "@/modules/community/GetAllTags";
import NewQuestions from "@/modules/community/NewQuestions";
import { SELECTED_TAG } from "@/shared/constants/storage";

const CommunityModule: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [isTagChanged, setIsTagChanged] = useState<boolean>(false);

    const handleSelectTag = (id: string | null) => {
        setIsTagChanged(true);
        setTimeout(() => {}, 100);
        if (id === null) {
            setSelectedTag("");
        } else {
            setSelectedTag(id);
        }
    };

    const handleIsTagChanged = () => setIsTagChanged(prev => !prev);

    useEffect(() => {
        localStorage.setItem(SELECTED_TAG, selectedTag);
    }, [selectedTag]);

    return (
        <Box
            sx={{
                width: "95%",
                minWidth: 350,
                maxWidth: 800,
                display: "flex",
                flexDirection: "column",
                padding: 1,
                alignItems: "center",
                justifyContent: "space-around"
            }}
        >
            {/* Ask Questions to NTastic */}
            <AskQuestions />
            {/* Get All tags */}
            <GetAllTags
                selectedTag={selectedTag}
                handleSelectTag={handleSelectTag}
            />
            {/* Get questions */}
            <NewQuestions
                selectedTag={selectedTag}
                isTagChanged={isTagChanged}
                handleIsTagChanged={handleIsTagChanged}
            />
        </Box>
    );
};

export default CommunityModule;