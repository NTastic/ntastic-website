import React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
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
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
                        <ListItemIcon>
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </List>
            <List>
                {sidebarItems.map((item) => (
                    <ListItem key={item} disablePadding sx={{ display: 'flex', justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemButton
                            sx={{
                                justifyContent: open ? 'initial' : 'center',
                                px: 2,
                                minHeight: 48,
                                gap: open ? 2 : 0,
                            }}
                            onClick={() => handleClick(item)}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    justifyContent: 'center',
                                }}
                            >
                                {iconList[item]}
                            </ListItemIcon>
                            <Collapse in={open} timeout={500} orientation="horizontal" unmountOnExit>
                                <ListItemText primary={item} />
                            </Collapse>
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
                width: open ? 200 : 60,
                transition: 'all 0.5s',
                '& .MuiDrawer-paper': {
                    width: open ? 200 : 60,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                },
            }}
        >
            {DrawerList}
        </Drawer>
    );
};

export default Sidebar;
