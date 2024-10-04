"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AskQuestions from "@/app/modules/community/AskQuestions";
import GetAllTags from "@/app/modules/community/GetAllTags";
import NewQuestions from "@/app/modules/community/NewQuestions";
import { SELECTED_TAGS } from "@/shared/constants/storage";

const CommunityModule: React.FC = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleSelectTags = (id: string | null, append: boolean) => {
        if (id === null) {
            setSelectedTags([]);
        } else if (append) {
            setSelectedTags((prevList) => [...prevList, id]);
        } else {
            setSelectedTags((prevList) => prevList.filter((item) => item !== id));
        }
    };

    useEffect(() => {
        localStorage.setItem(SELECTED_TAGS, selectedTags.join(";"));
    }, [selectedTags]);

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
            <GetAllTags selectedTags={selectedTags} handleSelectTags={handleSelectTags} />
            {/* Get questions */}
            <NewQuestions selectedTags={selectedTags} />
        </Box>
    );
};

export default CommunityModule;