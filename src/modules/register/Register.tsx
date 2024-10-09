"use client";
import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/validation/register/register.schema';
import { useMutation } from '@apollo/client';
import { REGISTER } from '@/graphql/user';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN, USER_ID } from '@/shared/constants/storage';
import { useForm } from 'react-hook-form';
import { Avatar, Box, Card, Typography, TextField, Button, Link, InputAdornment, IconButton, Checkbox } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { RouteConfig } from '@/routes/route';

const Register: React.FC = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [registerNewUser] = useMutation(REGISTER);
    const [registerInfo, setRegisterInfo] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);

    type RegisterValues = z.infer<typeof registerSchema>;
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleCheckbox = () => setIsChecked(!isChecked);

    const onSubmit = async (data: RegisterValues) => {
        setRegisterInfo(null);
        setRegisterError(null);

        if (!isChecked) {
            setRegisterError("Agreement to the Terms and Conditions is required!");
            return;
        }

        try {
            const response = await registerNewUser(
                { variables: { username: data.username, email: data.email, password: data.password } }
            );
            if (response.data.register) {
                localStorage.setItem(ACCESS_TOKEN, response.data.register.token);
                localStorage.setItem(USER_ID, response.data.register.user.id);
                setRegisterInfo("Few steps to go ...");
                setTimeout(() => router.push(RouteConfig.RegisterQuestion1.Path), 1000);
            } else {
                throw new Error("Invalid email or password!");
            }
        } catch (error: any) {
            setRegisterError((error as Error).message);
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
                        Register new account
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
                        Please fill out the form
                    </Typography>
                </Box>
                <TextField
                    variant="outlined"
                    label="User Name"
                    autoComplete='username'
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username ? errors.username.message : ""}
                    fullWidth
                />
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
                <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                    <Checkbox
                        aria-label="agree to terms and  conditions"
                        color="success"
                        edge="start"
                        checked={isChecked}
                        onChange={handleCheckbox}
                    />
                    <Typography
                        variant='body1'
                        sx={{ color: "#666", fontStyle: "italic", mr: 1 }}
                    >
                        By creating an account, you agree to our
                    </Typography>
                    <Link
                        href=""
                        sx={{ color: "#000", fontWeight: "bolder", fontStyle: "italic" }}
                    >
                        Terms and Conditions
                    </Link>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    sx={{
                        width: "100%",
                        borderRadius: "16px"
                    }}
                >
                    Sign up
                </Button>
                <Box
                    display="flex"
                    flexDirection="row"
                >
                    <Typography variant="body2" mr={1}>
                        Already have an account?
                    </Typography>
                    <Link href={RouteConfig.Login.Path}>
                        Sign in
                    </Link>
                </Box>
                {registerInfo && (
                    <Typography variant="body2" color="primary">
                        {registerInfo}
                    </Typography>
                )}
                {registerError && (
                    <Typography variant="body2" color="error">
                        {registerError}
                    </Typography>
                )}
            </Box>
        </Card>
    );
};

export default Register;