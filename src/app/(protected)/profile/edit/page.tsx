import React from "react";
import { RouteConfig } from "@/routes/route";
import EditProfile from "@/modules/profile/EditProfile";

export const metadata = RouteConfig.EditProfile.Metadata;

const EditProfilePage: React.FC = () => {
    return <EditProfile />
};

export default EditProfilePage;