import { z } from "zod";

export const EventFormSchema = z.object({
    title: z.string().min(3, {
        message: "username must be at least 2 characters"
    }),
    description: z.string().min(3, {
        message: "username must be at least 2 characters"
    }).max(400),
    location: z.string().min(3, {
        message: "username must be at least 2 characters"
    }).max(100),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),
})