import {z} from "zod";

export const registerSchema = z.object({
    username: z.string().min(
        1, "Username should have at least 1 characters"
    ).max(
        16, "Username should have at most 16 characters"
    ),
    email: z.string().min(
        1, "Valid email address is required"
    ).email(
        "Valid email address is required"
    ),
    password: z.string().min(
        8, "Password should have at least 8 characters"
    )
});