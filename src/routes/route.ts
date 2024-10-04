const Root = {
    Metadata: {
        title: "NTastic"
    },
    Path: "/" as const
};

const Login = {
    Metadata: {
        title: "NTastic | Login"
    },
    Path: "/login" as const
};

const Register = {
    Metadata: {
        title: "NTastic | Register"
    },
    Path: "/register" as const
};

const RegisterQuestion1 = {
    Metadata: {
        title: "NTastic | Register | Question 1"
    },
    Path: "/register/question-1" as const
};

const RegisterQuestion2 = {
    Metadata: {
        title: "NTastic | Register | Question 2"
    },
    Path: "/register/question-2" as const
};

const RegisterQuestion3 = {
    Metadata: {
        title: "NTastic | Register | Question 3"
    },
    Path: "/register/question-3" as const
};

const Community = {
    Metadata: {
        title: 'NTastic | Community'
    },
    Path: "/community" as const
};

const QuestionDetails = {
    Metadata: {
        title: "NTastic | Question Details"
    }
};

const PostAQuestion = {
    Metadata: {
        title: "NTastic | Post a Question"
    },
    Path: "/community/post-a-question"
}

export const RouteConfig = {
    Root,
    Login,
    Register,
    RegisterQuestion1,
    RegisterQuestion2,
    RegisterQuestion3,
    Community,
    QuestionDetails,
    PostAQuestion
};