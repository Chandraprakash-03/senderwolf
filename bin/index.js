#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";
import inquirer from "inquirer";
import { sendEmail } from "../lib/sendEmail.js";

const program = new Command();

program
    .name("senderwolf")
    .description("📨 The simplest way to send emails via SMTP from your terminal.")
    .version("2.0.0", "-v, --version", "Display senderwolf CLI version")
    .usage("[options]")
    .addHelpText(
        "after",
        `
Examples:
  $ senderwolf --user your@gmail.com --pass yourapppass \\
    --to someone@example.com --subject "Yo" --html "<h1>Hey</h1>"

  $ senderwolf --user your@gmail.com --pass yourapppass \\
    --to person@xyz.com --subject "Hello" --html ./email.html \\
    --attachments "invoice.pdf,logo.png"
`
    )
    .option("-u, --user <email>", "SMTP username (Gmail or other)")
    .option("-p, --pass <password>", "SMTP password or app password")
    .option("-t, --to <email>", "Recipient email")
    .option("-s, --subject <text>", "Email subject")
    .option("-h, --html <html>", "HTML content or path to .html file")
    .option("-x, --text <text>", "Plain text content (optional, overrides HTML if provided)")
    .option("-H, --host <host>", "SMTP host (default: smtp.gmail.com)")
    .option("-P, --port <port>", "SMTP port (default: 465)", parseInt)
    .option("-S, --secure <bool>", "Use SSL (default: true)", (value) => value === "true", true)
    .option("-n, --fromName <name>", "Sender name (default: Senderwolf)")
    .option("-e, --fromEmail <email>", "Sender email (default: --user)")
    .option("-a, --attachments <paths>", "Comma-separated file paths")
    .option("-i, --interactive", "Launch interactive mode")
    .option("-d, --dry-run", "Preview email without sending it", false)
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse();

const opts = program.opts();
const useInteractive = opts.interactive || Object.keys(opts).length === 0;

let smtp = {};
let mail = {};
let attachments = [];

if (useInteractive) {
    console.log(chalk.cyanBright("🐺 Senderwolf Interactive Mode\n"));

    let answers = {};
    try {
        answers = await inquirer.prompt([
            { name: "user", message: "Your email (SMTP username):" },
            { type: "password", name: "pass", message: "App password:", mask: "*" },
            { name: "fromName", message: "Your name (optional):" },
            { name: "to", message: "Recipient email:" },
            { name: "subject", message: "Email subject:" },
            { name: "html", message: "HTML content or .html file path:" },
            { name: "attachments", message: "Comma-separated attachments (optional):" },
        ]);
    } catch (err) {
        console.log(chalk.yellow("\n❌ Prompt cancelled. Exiting..."));
        process.exit(0);
    }

    let html = answers.html;
    try {
        if (typeof html === "string" && fs.existsSync(html) && html.endsWith(".html")) {
            html = fs.readFileSync(html, "utf-8");
        }
    } catch {
        // Use as string
    }

    attachments = answers.attachments
        ? answers.attachments.split(",").map((path) => ({
            filename: path.split("/").pop(),
            path,
        }))
        : [];

    smtp = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: answers.user,
            pass: answers.pass,
        },
    };

    mail = {
        to: answers.to,
        subject: answers.subject,
        html,
        attachments,
        fromName: answers.fromName || "Senderwolf",
        fromEmail: answers.user,
    };
} else {
    if (!opts.user || !opts.pass || !opts.to || !opts.subject || (!opts.html && !opts.text)) {
        console.log(chalk.red("❌ Missing required options.\n"));
        program.outputHelp();
        process.exit(1);
    }

    let html = opts.html;
    try {
        if (typeof html === "string" && fs.existsSync(html) && html.endsWith(".html")) {
            html = fs.readFileSync(html, "utf-8");
        }
    } catch {
        // Use as string
    }

    attachments = opts.attachments
        ? opts.attachments.split(",").map((path) => ({
            filename: path.split("/").pop(),
            path,
        }))
        : [];

    smtp = {
        host: opts.host || "smtp.gmail.com",
        port: opts.port || 465,
        secure: opts.secure,
        auth: {
            user: opts.user,
            pass: opts.pass,
        },
    };

    mail = {
        to: opts.to,
        subject: opts.subject,
        html: opts.text ? undefined : html,
        text: opts.text || undefined,
        attachments,
        fromName: opts.fromName || "Senderwolf",
        fromEmail: opts.fromEmail || opts.user,
    };
}

// 🧪 Dry-run mode
if (opts.dryRun) {
    console.log(chalk.yellow("🚫 Dry run mode enabled — no email sent.\n"));
    console.log(chalk.cyan("📬 SMTP Config:"));
    console.log(smtp);
    console.log("\n📧 Email Preview:");
    console.log({
        to: mail.to,
        from: mail.fromEmail || smtp.auth.user,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        attachments,
    });
    process.exit(0);
}

// 📤 Send email
console.log(chalk.cyan("📨 Sending email...\n"));

try {
    const result = await sendEmail({ smtp, mail });
    if (result.success) {
        console.log(chalk.green(`✅ Email sent! Message ID: ${result.messageId}`));
    } else {
        console.log(chalk.red(`❌ Failed: ${result.error}`));
    }
} catch (err) {
    console.log(chalk.red(`💥 Error: ${err.message}`));
}
