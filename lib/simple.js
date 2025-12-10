/**
 * Simple API wrapper for senderwolf - even easier than nodemailer
 * Provides convenience methods for common use cases
 */

import { sendEmail } from './sendEmail.js';
import { listProviders } from './providers.js';

/**
 * Create a reusable mailer instance with preset configuration
 */
export function createMailer(config = {}) {
    const defaultConfig = {
        smtp: config.smtp || {},
        defaults: config.defaults || {},
    };

    return {
        /**
         * Send a simple email
         */
        async send(options) {
            const merged = {
                smtp: { ...defaultConfig.smtp, ...options.smtp },
                mail: { ...defaultConfig.defaults, ...options },
            };
            return sendEmail(merged);
        },

        /**
         * Send HTML email
         */
        async sendHtml(to, subject, html, options = {}) {
            return this.send({ to, subject, html, ...options });
        },

        /**
         * Send text email
         */
        async sendText(to, subject, text, options = {}) {
            return this.send({ to, subject, text, ...options });
        },

        /**
         * Send email with attachments
         */
        async sendWithAttachments(to, subject, content, attachments, options = {}) {
            const mailOptions = {
                to,
                subject,
                attachments,
                ...options,
            };

            if (typeof content === 'string' && content.includes('<')) {
                mailOptions.html = content;
            } else {
                mailOptions.text = content;
            }

            return this.send(mailOptions);
        },

        /**
         * Send bulk emails (one by one to avoid spam filters)
         */
        async sendBulk(recipients, subject, content, options = {}) {
            const results = [];

            for (const recipient of recipients) {
                try {
                    const result = await this.send({
                        to: recipient,
                        subject,
                        ...(typeof content === 'string' && content.includes('<')
                            ? { html: content }
                            : { text: content }),
                        ...options,
                    });
                    results.push({ recipient, success: true, messageId: result.messageId });
                } catch (error) {
                    results.push({ recipient, success: false, error: error.message });
                }

                // Small delay to avoid overwhelming the server
                if (recipients.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            return results;
        },
    };
}

/**
 * Quick send functions for one-off emails
 */
export async function quickSend(provider, user, pass, to, subject, content, options = {}) {
    const config = {
        smtp: {
            provider,
            auth: { user, pass },
        },
        mail: {
            to,
            subject,
            ...(typeof content === 'string' && content.includes('<')
                ? { html: content }
                : { text: content }),
            ...options,
        },
    };

    return sendEmail(config);
}

/**
 * Gmail shortcut
 */
export async function sendGmail(user, pass, to, subject, content, options = {}) {
    return quickSend('gmail', user, pass, to, subject, content, options);
}

/**
 * Outlook shortcut
 */
export async function sendOutlook(user, pass, to, subject, content, options = {}) {
    return quickSend('outlook', user, pass, to, subject, content, options);
}

/**
 * Test email connectivity
 */
export async function testConnection(config) {
    try {
        const result = await sendEmail({
            ...config,
            mail: {
                to: config.smtp?.auth?.user || config.mail?.to,
                subject: 'Senderwolf Connection Test',
                text: 'This is a test email to verify SMTP connectivity.',
                ...config.mail,
            },
        });

        return {
            success: true,
            message: 'Connection successful',
            messageId: result.messageId,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            error: error,
        };
    }
}

/**
 * Get available providers
 */
export { listProviders };

/**
 * Export main function for backward compatibility
 */
export { sendEmail };