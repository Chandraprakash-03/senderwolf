import * as os from "os";
import { validateInput } from "./schema.js";
import { loadConfig } from "./config.js";
import { getProviderConfig, detectProvider } from "./providers.js";
import { SMTPClient } from "./smtpClient.js";
import { SMTPConnectionPool } from "./connectionPool.js";

// Global connection pools for different SMTP configurations
const connectionPools = new Map();

/**
 * Get or create a connection pool for the given SMTP configuration
 */
function getConnectionPool(smtpConfig) {
    const poolKey = `${smtpConfig.host}:${smtpConfig.port}:${smtpConfig.auth.user}`;

    if (!connectionPools.has(poolKey)) {
        const pool = new SMTPConnectionPool({
            maxConnections: smtpConfig.pool?.maxConnections || 5,
            maxMessages: smtpConfig.pool?.maxMessages || 100,
            rateDelta: smtpConfig.pool?.rateDelta || 1000,
            rateLimit: smtpConfig.pool?.rateLimit || 3,
            idleTimeout: smtpConfig.pool?.idleTimeout || 30000,
        });
        connectionPools.set(poolKey, pool);
    }

    return connectionPools.get(poolKey);
}

/**
 * Sends an email using any SMTP provider with enhanced features.
 * Supports multiple auth methods, CC/BCC, attachments, provider auto-detection, and connection pooling.
 *
 * @param {Object} input - The input config containing smtp and mail data.
 * @returns {Promise<Object>} - Result with success status and messageId or error.
 */
export async function sendEmail(input = {}) {
    let connection = null;
    let pool = null;

    try {
        const config = await loadConfig();

        // Auto-detect provider if not specified
        let providerConfig = {};
        const userEmail = input.smtp?.auth?.user || config.user;

        if (input.smtp?.provider) {
            // Use specified provider
            providerConfig = getProviderConfig(input.smtp.provider) || {};
        } else if (userEmail && !input.smtp?.host) {
            // Auto-detect from email domain
            providerConfig = getProviderConfig(userEmail) || {};
        }

        const merged = {
            smtp: {
                host: input.smtp?.host || config.host || providerConfig.host || "smtp.gmail.com",
                port: input.smtp?.port || config.port || providerConfig.port || 465,
                secure: typeof input.smtp?.secure === "boolean"
                    ? input.smtp.secure
                    : (config.secure ?? providerConfig.secure ?? true),
                requireTLS: input.smtp?.requireTLS ?? config.requireTLS ?? providerConfig.requireTLS ?? false,
                ignoreTLS: input.smtp?.ignoreTLS ?? config.ignoreTLS ?? false,
                connectionTimeout: input.smtp?.connectionTimeout || config.connectionTimeout || 60000,
                greetingTimeout: input.smtp?.greetingTimeout || config.greetingTimeout || 30000,
                socketTimeout: input.smtp?.socketTimeout || config.socketTimeout || 60000,
                debug: input.smtp?.debug ?? config.debug ?? false,
                name: input.smtp?.name || config.name || os.hostname(),
                pool: input.smtp?.pool || config.pool || {},
                usePool: input.smtp?.usePool ?? config.usePool ?? true,
                auth: {
                    user: input.smtp?.auth?.user || config.user,
                    pass: input.smtp?.auth?.pass || config.pass,
                    type: input.smtp?.auth?.type || config.authType || "login",
                    ...input.smtp?.auth,
                },
            },
            mail: {
                from: input.mail?.from || input.mail?.fromEmail || config.fromEmail || userEmail,
                to: input.mail?.to,
                cc: input.mail?.cc,
                bcc: input.mail?.bcc,
                replyTo: input.mail?.replyTo || config.replyTo,
                subject: input.mail?.subject,
                html: input.mail?.html,
                text: input.mail?.text,
                headers: input.mail?.headers || {},
                priority: input.mail?.priority || "normal",
                attachments: input.mail?.attachments || [],
                fromName: input.mail?.fromName || config.fromName || "Senderwolf",
                fromEmail: input.mail?.fromEmail || config.fromEmail || userEmail,
                encoding: input.mail?.encoding || "utf8",
                date: input.mail?.date,
                messageId: input.mail?.messageId,
            },
        };

        const { smtp, mail } = validateInput(merged);

        const mailOptions = {
            from: mail.from || mail.fromEmail,
            fromHeader: mail.fromName ? `"${mail.fromName}" <${mail.fromEmail}>` : mail.fromEmail,
            to: mail.to,
            cc: mail.cc,
            bcc: mail.bcc,
            replyTo: mail.replyTo,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
            headers: mail.headers,
            priority: mail.priority,
            attachments: mail.attachments,
            encoding: mail.encoding,
            date: mail.date,
            messageId: mail.messageId,
        };

        let messageId;

        if (smtp.usePool) {
            // Use connection pooling
            pool = getConnectionPool(smtp);
            connection = await pool.getConnection(smtp);
            messageId = await connection.sendMail(mailOptions);
            pool.releaseConnection(connection);
        } else {
            // Use direct connection (legacy behavior)
            const client = new SMTPClient(smtp);
            await client.connect();
            await client.readResponse();
            await client.authenticate();
            messageId = await client.sendMail(mailOptions);
            await client.quit();
        }

        return {
            success: true,
            messageId: messageId,
        };
    } catch (error) {
        if (connection && pool) {
            pool.releaseConnection(connection);
        }
        return {
            success: false,
            error: error.message || "Unknown error while sending email",
        };
    }
}

/**
 * Close all connection pools (useful for graceful shutdown)
 */
export async function closeAllPools() {
    const closePromises = Array.from(connectionPools.values()).map(pool => pool.close());
    await Promise.all(closePromises);
    connectionPools.clear();
}

/**
 * Get statistics for all connection pools
 */
export function getPoolStats() {
    const stats = {};
    for (const [key, pool] of connectionPools.entries()) {
        stats[key] = pool.getStats();
    }
    return stats;
}
