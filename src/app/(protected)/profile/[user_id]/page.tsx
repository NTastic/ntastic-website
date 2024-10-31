"use client";
import React, { useEffect } from "react";
import { RouteConfig } from "@/routes/route";
import Profile from "@/modules/profile/Profile";

const ProfilePage: React.FC<{ params: { user_id: string } }> = ({ params }) => {
    useEffect(() => {
        const metadata = RouteConfig.Profile(params.user_id).Metadata;
        document.title = metadata.title;
    }, []);

    return <Profile user_id={params.user_id} />;
};

export default ProfilePage;