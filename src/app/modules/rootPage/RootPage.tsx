"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";
import { ACCESS_TOKEN } from "@/shared/constants/storage";

const RootPage: React.FC = () => {
    const router = useRouter();
    const accessToken = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;

    useEffect(() => {
        if (accessToken) {
            router.push(RouteConfig.Community.Path);
        } else {
            router.push(RouteConfig.Login.Path);
        }
    }, [accessToken]);

    return null;
};

export default RootPage;