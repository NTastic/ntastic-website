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
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";

const sidebarItems = ["Home", "Community", "Settings"];
const iconList: { [key: string]: React.ReactNode } = {
    Home: <HomeIcon />,
    Community: <ForumIcon />,
    Settings: <SettingsIcon />
};

interface SidebarProps {
    open: boolean;
    handleDrawerClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
    open, handleDrawerClose
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
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                        <ListItemIcon>
                            <ChevronLeftIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </List>
            <List>
                {sidebarItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton
                            sx={{ justifyContent: open ? 'initial' : 'center', px: 2 }}
                            onClick={() => handleClick(item)}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                                {iconList[item]}
                            </ListItemIcon>
                            <ListItemText primary={item} sx={{ opacity: 1 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer
                open={open}
                onClose={handleDrawerClose}
                sx={{
                    flexShrink: 1,
                    '& .MuiDrawer-paper': {
                        width: 200,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {DrawerList}
            </Drawer>
        </div>
    );
};

export default Sidebar;