import { z } from "zod";

const smtpSchema = z
    .object({
        host: z.string().optional(),
        port: z.number().optional(),
        secure: z.boolean().optional(),
        auth: z.object({
            user: z.string().email(),
            pass: z.string().min(2),
        }),
    })
    .optional();

const mailSchema = z.object({
    to: z.union([z.string().email(), z.array(z.string().email())]),
    subject: z.string(),
    html: z.string(),
    fromName: z.string().optional(),
    fromEmail: z.string().email().optional(),
    attachments: z
        .array(
            z.object({
                filename: z.string(),
                path: z.string(),
            })
        )
        .optional(),
});

export function validateInput(input) {
    const schema = z.object({
        smtp: smtpSchema,
        mail: mailSchema,
    });

    return schema.parse(input);
}
