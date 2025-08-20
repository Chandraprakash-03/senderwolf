import { z } from "zod";

const email = z.string().email();

// SMTP schema
const smtpSchema = z
    .object({
        host: z.string().optional(),
        port: z.number().optional(),
        secure: z.boolean().optional(),
        auth: z.object({
            user: z.string().min(1),
            pass: z.string().min(2),
        }),
    })
    .optional();

// Mail schema
const mailSchema = z
    .object({
        to: z.union([email, z.array(email)]),
        subject: z.string(),
        html: z.string().optional(),
        text: z.string().optional(),
        fromName: z.string().optional(),
        fromEmail: email.optional(),
        attachments: z
            .array(
                z.object({
                    filename: z.string(),
                    path: z.string(),
                })
            )
            .optional(),
    })
    .refine((data) => data.html || data.text, {
        message: "Either 'html' or 'text' must be provided in mail body.",
        path: ["html"],
    });

export function validateInput(input) {
    const schema = z.object({
        smtp: smtpSchema,
        mail: mailSchema,
    });

    return schema.parse(input);
}
