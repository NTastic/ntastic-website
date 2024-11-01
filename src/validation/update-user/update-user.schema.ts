import {z} from "zod";

export const updateUserSchema = z.object({
    username: z.string().min(1, "Username should have at least 1 characters"),
    avatarId: z.string().nullable(),
    description: z.string().max(140, "Maximum words: 140").nullable()
});