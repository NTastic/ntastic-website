"use client";
import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Button,
    Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import { ACCESS_TOKEN, USER_ID } from '@/shared/constants/storage';

interface TopbarProps {
    handleDrawerOpen: () => void;
};

const Topbar: React.FC<TopbarProps> = ({ handleDrawerOpen }) => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [auth, setAuth] = React.useState<boolean>(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    useEffect(() => {
        const accessToken = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;
        setAccessToken(accessToken);
    }, []);

    useEffect(() => {
        if (accessToken) {
            setAuth(true);
        } else {
            setAuth(false);
        }
    }, [accessToken, auth]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleLogOut = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(USER_ID);
        window.location.reload();
    };

    return (
        <AppBar position='fixed' sx={{ backgroundColor: '#f8f8f8' }}>
            <Toolbar>
                <IconButton
                    size='large'
                    edge='start'
                    color='info'
                    aria-label='menu'
                    sx={{ mr: 2 }}
                    onClick={handleDrawerOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Box
                    flexGrow={1}
                >
                    <Button
                        onClick={() => { router.push(RouteConfig.Community.Path) }}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "transparent",
                            border: "none",
                            gap: 1
                        }}
                    >
                        <Avatar
                            src="https://i.postimg.cc/mkryN7K0/NTastic-icon.png"
                            style={{ width: '50px', height: '50px', objectFit: "cover", backgroundPosition: "center" }}
                        />
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ fontWeight: 'bold', color: '#000' }}
                        >
                            NTastic
                        </Typography>
                    </Button>
                </Box>
                <IconButton
                    size='large'
                    edge='start'
                    color='warning'
                    aria-label='notifications'
                    sx={{ mr: 2 }}
                >
                    <NotificationsIcon />
                </IconButton>
                {auth && (
                    <div>
                        <IconButton
                            size='large'
                            aria-label='account'
                            aria-controls='menu-appbar'
                            aria-haspopup='true'
                            onClick={handleMenu}
                            color='primary'
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            id='menu-appbar'
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem>
                                Profile
                            </MenuItem>
                            <MenuItem>
                                My account
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleLogOut()}
                            >
                                Log out
                            </MenuItem>
                        </Menu>
                    </div>
                )}
                {!auth && (
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{
                            borderRadius: "16px"
                        }}
                        onClick={() => {
                            router.push(RouteConfig.Login.Path);
                        }}
                    >
                        Sign in
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;