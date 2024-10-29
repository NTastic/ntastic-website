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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import { ACCESS_TOKEN, USER_ID } from '@/shared/constants/storage';

const Topbar: React.FC = () => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [auth, setAuth] = React.useState<boolean>(false);
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
                <Box
                    sx={{
                        position: "absolute",
                        left: "calc(50% + 30px)",
                        transform: "translateX(-50%)"
                    }}
                >
                    <Button
                        onClick={() => { router.push(RouteConfig.Home.Path) }}
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
                {auth && (
                    <Box
                        sx={{
                            position: "absolute",
                            right: "3%",
                            transform: "translateX(3%)"
                        }}
                    >
                        <IconButton
                            size='large'
                            edge='end'
                            color='warning'
                            aria-label='notifications'
                            sx={{ mr: 2 }}
                        >
                            <NotificationsIcon />
                        </IconButton>
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
                    </Box>
                )}
                {!auth && (
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{
                            position: "absolute",
                            right: "3%",
                            transform: "translateX(3%)",
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