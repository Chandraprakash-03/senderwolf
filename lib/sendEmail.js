import nodemailer from "nodemailer";
import { validateInput } from "./schema.js";

/**
 * Sends an email using any SMTP provider with fallback to Gmail.
 * Supports attachments and custom sender name/email.
 *
 * @param {Object} input - The input config containing smtp and mail data.
 * @returns {Promise<Object>} - Result with success status and messageId or error.
 */
export async function sendEmail(input) {
    const { smtp, mail } = validateInput(input);

    const useCustomSMTP = smtp?.host && smtp?.auth?.user && smtp?.auth?.pass;

    // Fallback to Gmail only if no custom SMTP provided
    const transporter = nodemailer.createTransport({
        host: useCustomSMTP ? smtp.host : "smtp.gmail.com",
        port: useCustomSMTP ? smtp.port || 465 : 465,
        secure: smtp?.secure ?? true,
        auth: {
            user: smtp?.auth.user,
            pass: smtp?.auth.pass,
        },
    });

    const fromEmail = mail.fromEmail || smtp?.auth.user || "no-reply@senderwolf.com";
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
            error: error.message || "Unknown error while sending email",
        };
    }
}
