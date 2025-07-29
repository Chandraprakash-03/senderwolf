import nodemailer from 'nodemailer';
import { emailSchema } from './schema.js';

/**
 * Send an email using Gmail SMTP
 * @param {Object} input - { auth: { user, pass }, mail: { to, subject, html, ... } }
 */
export async function sendEmail(input) {
    try {
        const { auth, mail } = emailSchema.parse(input);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            pool: true,
            maxConnections: 5,
            rateLimit: 5,
            auth: {
                user: auth.user,
                pass: auth.pass
            }
        });

        const mailOptions = {
            from: `"${mail.fromName || "senderwolf"}" <${mail.fromEmail || auth.user}>`,
            to: mail.to,
            subject: mail.subject,
            html: mail.html,
            attachments: mail.attachments || []
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Email sent to ${mail.to} (ID: ${info.messageId})`);

        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };

    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
        throw new Error(error.message || "Failed to send email");
    }
}
