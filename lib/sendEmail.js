import nodemailer from "nodemailer";
import { validateInput } from "./schema.js";
import { loadConfig } from "./config.js";

/**
 * Sends an email using any SMTP provider with fallback to Gmail.
 * Supports attachments, text/html, and config defaults.
 *
 * @param {Object} input - The input config containing smtp and mail data.
 * @returns {Promise<Object>} - Result with success status and messageId or error.
 */
export async function sendEmail(input = {}) {
    try {
        const config = await loadConfig();

        const merged = {
            smtp: {
                host: input.smtp?.host || config.host || "smtp.gmail.com",
                port: input.smtp?.port || config.port || 465,
                secure:
                    typeof input.smtp?.secure === "boolean"
                        ? input.smtp.secure
                        : config.secure ?? true,
                auth: {
                    user: input.smtp?.auth?.user || config.user,
                    pass: input.smtp?.auth?.pass || config.pass,
                },
            },
            mail: {
                to: input.mail?.to,
                subject: input.mail?.subject,
                html: input.mail?.html,
                text: input.mail?.text,
                attachments: input.mail?.attachments || [],
                fromName: input.mail?.fromName || config.fromName || "Senderwolf",
                fromEmail: input.mail?.fromEmail || config.fromEmail || input.smtp?.auth?.user || config.user,
            },
        };

        const { smtp, mail } = validateInput(merged);

        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure,
            auth: {
                user: smtp.auth.user,
                pass: smtp.auth.pass,
            },
        });

        const mailOptions = {
            from: `"${mail.fromName}" <${mail.fromEmail}>`,
            to: mail.to,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
            attachments: mail.attachments,
        };

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
