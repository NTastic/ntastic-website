"use client";
import React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";

const sidebarItems = [
    "Home",
    "Community",
    // "Settings"
];
const iconList: { [key: string]: React.ReactNode } = {
    Home: <HomeIcon />,
    Community: <ForumIcon />,
    Settings: <SettingsIcon />
};

interface SidebarProps {
    open: boolean;
    handleDrawerOpen: () => void;
    handleDrawerClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
    open, handleDrawerOpen, handleDrawerClose
}) => {
    const router = useRouter();

    const handleClick = (item: string) => {
        if (item === "Home") {
            router.push(RouteConfig.Home.Path);
        } else if (item === "Community") {
            router.push(RouteConfig.Community.Path);
        }
        handleDrawerClose();
    };

    const DrawerList = (
        <Box role="presentation">
            <List
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: 'start',
                }}
            >
                <ListItem
                    disablePadding
                >
                    <ListItemButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
                        <ListItemIcon
                            sx={{ justifyContent: "start" }}
                        >
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                {sidebarItems.map((item) => (
                    <ListItem
                        key={item}
                        disablePadding
                    >
                        <ListItemButton
                            onClick={() => handleClick(item)}
                        >
                            <ListItemIcon
                                sx={{ justifyContent: "start", gap: 1 }}
                            >
                                {iconList[item]}
                            </ListItemIcon>
                            {/* <Collapse in={open} timeout={500} orientation="horizontal" unmountOnExit>
                                <ListItemText sx={{fontSize: "medium"}}>{item}</ListItemText>
                            </Collapse> */}
                            <ListItemText sx={{fontSize: "medium"}}>{item}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                flexShrink: 0,
                width: open ? 180 : 50,
                transition: 'all 0.5s',
                '& .MuiDrawer-paper': {
                    flexShrink: 0,
                    width: open ? 180 : 50,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    transition: 'all 0.5s',
                },
            }}
        >
            {DrawerList}
        </Drawer>
    );
};

export default Sidebar;
