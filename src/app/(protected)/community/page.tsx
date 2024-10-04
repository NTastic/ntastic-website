import React from "react";
import CommunityModule from "@/app/modules/community/Community";
import { RouteConfig } from "@/routes/route";

export const metadata = RouteConfig.Community.Metadata;

const Community: React.FC = () => {
    return <CommunityModule />;
};

export default Community;