import React from 'react';
import QuestionDetails from '@/app/modules/community/QuestionDetails';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.QuestionDetails.Metadata;

const QuestionDetailsPage: React.FC<{
    params: {id: string}
}> = ({params}) => {
    return <QuestionDetails params={params}/>;
};

export default QuestionDetailsPage;