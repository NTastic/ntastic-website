import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().min(
        1, "Valid email address is required"
    ).email(
        "Valid email address is required"
    ),
    password: z.string().min(
        8, "Password should have at least 8 characters"
    )
});