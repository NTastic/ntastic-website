"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AskQuestions from "@/modules/community/AskQuestions";
import GetAllTags from "@/modules/community/GetAllTags";
import NewQuestions from "@/modules/community/NewQuestions";
import { SELECTED_TAG } from "@/shared/constants/storage";

const CommunityModule: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string>("");

    const handleSelectTag = (id: string | null) => {
        if (id === null) {
            setSelectedTag("");
        } else {
            setSelectedTag(id);
        }
    };

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
                margin: { xs: 1, md: 0 },
                alignItems: "center",
                justifyContent: "space-around"
            }}
        >
            {/* Ask Questions to NTastic */}
            <AskQuestions />
            {/* Get All tags */}
            <GetAllTags selectedTag={selectedTag} handleSelectTag={handleSelectTag} />
            {/* Get questions */}
            <NewQuestions selectedTag={selectedTag} />
        </Box>
    );
};

export default CommunityModule;