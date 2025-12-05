import * as tls from "tls";
import * as net from "net";
import * as fs from "fs";
import * as path from "path";
import { validateInput } from "./schema.js";
import { loadConfig } from "./config.js";

/**
 * Native SMTP client implementation
 */
class SMTPClient {
    constructor(config) {
        this.host = config.host;
        this.port = config.port;
        this.secure = config.secure;
        this.user = config.auth.user;
        this.pass = config.auth.pass;
        this.socket = null;
        this.buffer = "";
    }

    async connect() {
        return new Promise((resolve, reject) => {
            const onConnect = () => {
                this.socket.removeListener("error", onError);
                resolve();
            };

            const onError = (err) => {
                this.socket?.removeListener("connect", onConnect);
                reject(err);
            };

            if (this.secure) {
                this.socket = tls.connect({ host: this.host, port: this.port, servername: this.host });
            } else {
                this.socket = net.connect({ host: this.host, port: this.port });
            }

            this.socket.once("connect", onConnect);
            this.socket.once("error", onError);
            this.socket.setEncoding("utf8");
        });
    }

    async readResponse() {
        return new Promise((resolve, reject) => {
            const onData = (chunk) => {
                this.buffer += chunk;
                const lines = this.buffer.split("\r\n");

                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i];
                    if (line.length >= 3 && line[3] === " ") {
                        this.buffer = lines.slice(i + 1).join("\r\n");
                        this.socket.removeListener("data", onData);
                        this.socket.removeListener("error", onError);
                        resolve(line);
                        return;
                    }
                }
            };

            const onError = (err) => {
                this.socket.removeListener("data", onData);
                reject(err);
            };

            this.socket.on("data", onData);
            this.socket.once("error", onError);
        });
    }

    async sendCommand(command, expectCode = "250") {
        this.socket.write(command + "\r\n");
        const response = await this.readResponse();
        if (!response.startsWith(expectCode)) {
            throw new Error(`SMTP Error: ${response}`);
        }
        return response;
    }

    async authenticate() {
        await this.sendCommand("EHLO " + this.host);
        await this.sendCommand("AUTH LOGIN", "334");
        await this.sendCommand(Buffer.from(this.user).toString("base64"), "334");
        await this.sendCommand(Buffer.from(this.pass).toString("base64"), "235");
    }

    async sendMail(mailOptions) {
        await this.sendCommand(`MAIL FROM:<${mailOptions.from}>`);

        const recipients = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
        for (const recipient of recipients) {
            await this.sendCommand(`RCPT TO:<${recipient.trim()}>`);
        }

        await this.sendCommand("DATA", "354");

        const messageId = `<${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${this.host}>`;
        const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        let message = `From: ${mailOptions.fromHeader}\r\n`;
        message += `To: ${recipients.join(", ")}\r\n`;
        message += `Subject: ${mailOptions.subject}\r\n`;
        message += `Message-ID: ${messageId}\r\n`;
        message += `Date: ${new Date().toUTCString()}\r\n`;
        message += `MIME-Version: 1.0\r\n`;

        const hasAttachments = mailOptions.attachments && mailOptions.attachments.length > 0;

        if (hasAttachments) {
            message += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;
            message += `--${boundary}\r\n`;
        }

        if (mailOptions.html && mailOptions.text) {
            const altBoundary = `----=_Part_Alt_${Date.now()}`;
            message += `Content-Type: multipart/alternative; boundary="${altBoundary}"\r\n\r\n`;
            message += `--${altBoundary}\r\n`;
            message += `Content-Type: text/plain; charset=utf-8\r\n\r\n`;
            message += `${mailOptions.text}\r\n\r\n`;
            message += `--${altBoundary}\r\n`;
            message += `Content-Type: text/html; charset=utf-8\r\n\r\n`;
            message += `${mailOptions.html}\r\n\r\n`;
            message += `--${altBoundary}--\r\n`;
        } else if (mailOptions.html) {
            message += `Content-Type: text/html; charset=utf-8\r\n\r\n`;
            message += `${mailOptions.html}\r\n`;
        } else if (mailOptions.text) {
            message += `Content-Type: text/plain; charset=utf-8\r\n\r\n`;
            message += `${mailOptions.text}\r\n`;
        }

        if (hasAttachments) {
            for (const attachment of mailOptions.attachments) {
                const fileContent = fs.readFileSync(attachment.path);
                const base64Content = fileContent.toString("base64");
                const filename = attachment.filename || path.basename(attachment.path);

                message += `\r\n--${boundary}\r\n`;
                message += `Content-Type: application/octet-stream; name="${filename}"\r\n`;
                message += `Content-Transfer-Encoding: base64\r\n`;
                message += `Content-Disposition: attachment; filename="${filename}"\r\n\r\n`;

                for (let i = 0; i < base64Content.length; i += 76) {
                    message += base64Content.substring(i, i + 76) + "\r\n";
                }
            }
            message += `--${boundary}--\r\n`;
        }

        message += "\r\n.\r\n";
        this.socket.write(message);

        const response = await this.readResponse();
        if (!response.startsWith("250")) {
            throw new Error(`Failed to send email: ${response}`);
        }

        return messageId;
    }

    async quit() {
        try {
            await this.sendCommand("QUIT", "221");
        } catch (e) {
            // Ignore quit errors
        }
        this.socket?.end();
        this.socket?.destroy();
    }
}

/**
 * Sends an email using any SMTP provider with fallback to Gmail.
 * Supports attachments, text/html, and config defaults.
 *
 * @param {Object} input - The input config containing smtp and mail data.
 * @returns {Promise<Object>} - Result with success status and messageId or error.
 */
export async function sendEmail(input = {}) {
    let client = null;
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

        client = new SMTPClient(smtp);

        await client.connect();
        await client.readResponse();
        await client.authenticate();

        const mailOptions = {
            from: mail.fromEmail,
            fromHeader: `"${mail.fromName}" <${mail.fromEmail}>`,
            to: mail.to,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
            attachments: mail.attachments,
        };

        const messageId = await client.sendMail(mailOptions);
        await client.quit();

        return {
            success: true,
            messageId: messageId,
        };
    } catch (error) {
        if (client) {
            await client.quit();
        }
        return {
            success: false,
            error: error.message || "Unknown error while sending email",
        };
    }
}
