import React from "react";
import PostAQuestion from "@/app/modules/community/PostAQuestion";
import { RouteConfig } from "@/routes/route";

export const metadata = RouteConfig.PostAQuestion.Metadata;

const PostQuestionPage: React.FC = () => {
    return <PostAQuestion />;
};

export default PostQuestionPage;