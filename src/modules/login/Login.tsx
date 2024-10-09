"use client";
import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validation/login/login.schema';
import { LOGIN } from '@/graphql/user';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import {
    Avatar,
    Box,
    Button,
    Card,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN, USER_ID } from '@/shared/constants/storage';
import { RouteConfig } from '@/routes/route';

const Login: React.FC = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [login] = useMutation(LOGIN);
    const [loginInfo, setLoginInfo] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);

    type LoginValues = z.infer<typeof loginSchema>;
    const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const onSubmit = async (data: LoginValues) => {
        setLoginInfo(null);
        setLoginError(null);
        
        try {
            const response = await login(
                { variables: { email: data.email, password: data.password } }
            );
            if (response.data.login) {
                localStorage.setItem(ACCESS_TOKEN, response.data.login.token);
                localStorage.setItem(USER_ID, response.data.login.user.id);
                setLoginInfo("Sign in successfully!");
                setTimeout(() => router.push(RouteConfig.Community.Path), 1000);
            } else {
                throw new Error("Invalid email or password!");
            }
        } catch (error: any) {
            setLoginError((error as Error).message);
        }
    };

    return (
        <Card
            sx={{
                width: "100%",
                minWidth: 350,
                maxWidth: 800,
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
                mr: 1,
                ml: 1
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    gap: 2,
                    padding: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "280px",
                        alignItems: "center"
                    }}
                >
                    <Avatar
                        src="https://i.postimg.cc/mkryN7K0/NTastic-icon.png"
                        sx={{ width: "160px", height: "160px", objectFit: "cover", backgroundPosition: "center" }}
                    />
                    <Box
                        sx={{
                            height: "70px",
                            width: "120px",
                            backgroundImage: "url(https://i.postimg.cc/c4HnDx6G/slogan.png)",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat"
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        width: "100%",
                    }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            width: "100%",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            textAlign: "start",
                        }}>
                        Welcome Back
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            width: "100%",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            color: "#666",
                            textAlign: "start"
                        }}>
                        Please login to your account
                    </Typography>
                </Box>
                <TextField
                    variant="outlined"
                    label="Email"
                    autoComplete='email'
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    fullWidth
                />
                <TextField
                    variant="outlined"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete='pasword'
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    fullWidth
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        width: "100%",
                        borderRadius: "16px"
                    }}
                >
                    Sign in
                </Button>
                <Box
                    display="flex"
                    flexDirection="row"
                >
                    <Typography variant="body2" mr={1}>
                        Don't have an account?
                    </Typography>
                    <Link href={RouteConfig.Register.Path}>
                        Sign up
                    </Link>
                </Box>
                {loginInfo && (
                    <Typography variant="body2" color="primary">
                        {loginInfo}
                    </Typography>
                )}
                {loginError && (
                    <Typography variant="body2" color="error">
                        {loginError}
                    </Typography>
                )}
            </Box>
        </Card>
    );
};

export default Login;