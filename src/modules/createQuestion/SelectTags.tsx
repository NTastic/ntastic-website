"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TAGS } from "@/graphql/qa";
import { TransitionProps } from "@mui/material/transitions";
import { Avatar, Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemButton, Typography } from "@mui/material";
import Slide from '@mui/material/Slide';
import ChevronRight from "@mui/icons-material/ChevronRight";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { iconMap } from "@/routes";

const transition = React.forwardRef(function transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} timeout={500} {...props} />
});

interface SelectTagsProps {
    open: boolean;
    tags: string[];
    handleSelectTag: (selectedTag: string) => void;
    handleCloseTagsSelection: () => void;
};

type TagValue = {
    id: string;
    name: string;
    questionCount: number;
};

export default function SelectTags(
    {
        open,
        tags,
        handleSelectTag,
        handleCloseTagsSelection
    }: SelectTagsProps
) {
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

    const isTagSelected = (tag: string) => {
        return tags.includes(tag);
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseTagsSelection}
            TransitionComponent={transition}
            keepMounted
            aria-describedby="slide-tag-selection"
            sx={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
                transition: "transform 0.3s ease-in-out",
                "& .MuiPaper-root": {
                    minWidth: "500px",
                    padding: 3,
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                Choose Tags
            </DialogTitle>
            <DialogContent
                sx={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 3
                }}
            >
                <List sx={{ width: "100%" }}>
                    {tagList.map((item: TagValue) => (
                        <ListItem key={item.id}>
                            <ListItemButton
                                onClick={() => handleSelectTag(item.id)}
                                sx={{
                                    borderRadius: "16px"
                                }}
                            >
                                <Avatar
                                    sx={{
                                        mr: 1,
                                        width: "45px",
                                        height: "45px",
                                        objectFit: "contain",
                                        backgroundColor: "#fff"
                                    }}
                                >
                                    <img
                                        src={iconMap[item.name]}
                                        style={{ width: "30px", height: "30px", backgroundColor: "#fff" }}
                                    />
                                </Avatar>
                                <Box flexGrow={1}>
                                    <Box display="flex" flexDirection="column">
                                        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000" }}>
                                            # {item.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#ccc" }}>
                                            {item.questionCount} discussions
                                        </Typography>
                                    </Box>
                                </Box>
                                <Checkbox
                                    edge="end"
                                    color="primary"
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<RadioButtonCheckedIcon />}
                                    checked={isTagSelected(item.id)}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        width: "70%",
                        height: "50px",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        position: "fixed",
                        bottom: 10,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                    onClick={handleCloseTagsSelection}
                >
                    <Typography>TAG THE QUESTION</Typography>
                    <ChevronRight sx={{ width: "30px", height: "30px" }} />
                </Button>
            </DialogContent>
        </Dialog>
    );
};