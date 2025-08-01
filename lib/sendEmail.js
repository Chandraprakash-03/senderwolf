import nodemailer from "nodemailer";
import { validateInput } from "./schema.js";

/**
 * Send an email using any SMTP provider.
 * Falls back to Gmail if smtp config is missing.
 */
export async function sendEmail(input) {
    const { smtp, mail } = validateInput(input);

    // Fallback to Gmail if no custom SMTP provided
    const transporter = nodemailer.createTransport({
        host: smtp?.host || "smtp.gmail.com",
        port: smtp?.port || 465,
        secure: smtp?.secure ?? true,
        auth: {
            user: smtp?.auth.user,
            pass: smtp?.auth.pass,
        },
    });

    const fromEmail = mail.fromEmail || smtp?.auth.user;
    const fromName = mail.fromName || "Senderwolf";

    const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        attachments: mail.attachments || [],
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: result.messageId,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}
