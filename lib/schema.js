import { z } from 'zod';

export const emailSchema = z.object({
    auth: z.object({
        user: z.string().email(),
        pass: z.string().min(8)
    }),
    mail: z.object({
        fromName: z.string().optional(),
        fromEmail: z.string().email().optional(),
        to: z.string().email(),
        subject: z.string().min(1),
        html: z.string().min(1),
        attachments: z.array(
            z.object({
                filename: z.string(),
                path: z.string() // Accepts local path or URL
            })
        ).optional()
    })
});
