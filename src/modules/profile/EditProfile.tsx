"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { USER_ID } from "@/shared/constants/storage";
import { GET_USER, UPDATE_USER } from "@/graphql/user";
import { UserValue } from "@/shared/constants/types";
import { UPLOAD_IMAGE } from "@/graphql/qa";
import { useQuery, useMutation } from "@apollo/client";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { updateUserSchema } from "@/validation/update-user/update-user.schema";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Avatar, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { compressImage } from "@/utils/CompressFile";
import { SpinningHourglass } from "@/utils/Animations";

type UserInput = z.infer<typeof updateUserSchema>;

const EditProfile: React.FC = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<UserValue | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);
    const [isHoverOverAvatar, setIsHoverOverAvatar] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const [updateUser] = useMutation(UPDATE_USER);

    const { data: userData } = useQuery(
        GET_USER,
        { variables: { getUserId: userId }, skip: !userId }
    );

    const { getValues, register, handleSubmit, formState: { errors }, reset } = useForm<UserInput>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            username: "",
            avatarId: null,
            description: null
        }
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files: File[] = Array.from(event.target.files || []);
        if (files.length > 0) {
            const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
            setSelectedAvatar(compressedFiles[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(compressedFiles[0]);
        }
    };

    const handleHoverAvatar = () => setIsHoverOverAvatar(true);

    const handleLeaveAvatar = () => setIsHoverOverAvatar(false);

    const onSubmit = async (data: UserInput) => {
        setUpdateInfo(null);
        setUpdateError(null);
        try {
            if (selectedAvatar) {
                const { data: uploadResponse } = await uploadImage({
                    variables: { file: selectedAvatar }
                });
                if (uploadResponse && uploadResponse.uploadImage) {
                    reset({
                        ...getValues(),
                        avatarId: uploadResponse.uploadImage.id
                    });
                }
            }
            console.log("values: ", getValues());
            const { data: updateUserResponse } = await updateUser({
                variables: { input: getValues() }
            });
            if (updateUserResponse && updateUserResponse.updateUser.id) {
                setUpdateInfo("Update Success!");
                setTimeout(() => { window.location.reload() }, 1000);
            }
        } catch (error) {
            setUpdateError((error as Error).message);
        }
    }

    useEffect(() => {
        const userId = typeof window !== "undefined" ? localStorage.getItem(USER_ID) : null;
        setUserId(userId);
    }, []);

    useEffect(() => {
        if (userData) {
            setUser(userData.getUser || null);
        }
    }, [userData]);

    useEffect(() => {
        if (user) {
            reset({
                username: user.username,
                avatarId: null,
                description: user.description
            });
            setSelectedAvatarUrl(user.avatar || null);
        }
    }, [user])

    if (!user) {
        return (
            <Box
                sx={{
                    width: "95%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <SpinningHourglass />
            </Box>
        );
    }

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
            {/* Return */}
            <Box width="100%">
                <IconButton onClick={() => { router.back(); }} edge="start">
                    <ChevronLeftIcon />
                </IconButton>
            </Box>
            {/* Edit Avatar */}
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
            />
            <Box
                onMouseOver={handleHoverAvatar}
                onMouseLeave={handleLeaveAvatar}
                sx={{
                    position: "relative",
                    display: "inline-block",
                    width: "100px",
                    height: "100px"
                }}
            >
                <Avatar
                    src={selectedAvatarUrl || "none"}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundPosition: "center",
                        mb: 1
                    }}
                />
                <Button
                    variant="text"
                    sx={{
                        position: "absolute",
                        bottom: "5px",
                        left: "50%",
                        transform: isHoverOverAvatar ? "translate(-50%, 0)" : "translate(-50%, 5px)",
                        opacity: isHoverOverAvatar ? 1 : 0,
                        borderRadius: "16px",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                        color: selectedAvatarUrl ? "#fff" : "#000",
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "large"
                    }}
                    onClick={triggerFileInput}
                >
                    Edit
                </Button>
            </Box>
            {/* Edit username & description */}
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "space-around",
                    gap: 2,
                    padding: 2
                }}
            >
                {/* username */}
                <TextField
                    variant="outlined"
                    label="User Name"
                    autoComplete='username'
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username ? errors.username.message : ""}
                    fullWidth
                    InputLabelProps={{
                        shrink: Boolean(user.username)
                    }}
                />
                {/* description */}
                <TextField
                    variant="outlined"
                    label="Description"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description ? errors.description.message : ""}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={6}
                    InputLabelProps={{
                        shrink: Boolean(user.description)
                    }}
                />
                {/* Submit Button */}
                <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{borderRadius: "16px"}}
                >
                    Update
                </Button>
            </Box>
            {updateInfo && (
                <Typography ></Typography>
            )}
        </Box>
    );
};

export default EditProfile;