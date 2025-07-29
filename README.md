# senderwolf

> Lightweight, secure Gmail SMTP sender for Node.js

**senderwolf** lets you dynamically send emails with attachments using Gmail SMTP.  
Built for developers who want full control without hardcoded credentials — now with input validation, performance optimization, and a minimal setup.

---

## Install

```bash
npm install senderwolf
```

---

## Usage

```js
import { sendEmail } from "senderwolf";

await sendEmail({
	auth: {
		user: "your-email@gmail.com",
		pass: "your-app-password",
	},
	mail: {
		fromName: "Your Name",
		fromEmail: "your-email@gmail.com",
		to: "receiver@example.com",
		subject: "Hello",
		html: "<h1>Hi there!</h1>",
		attachments: [{ filename: "invoice.pdf", path: "./invoice.pdf" }],
	},
});
```

---

## Gmail Setup Required

You **must use an App Password**, not your regular Gmail login.

🔐 Follow these steps:

1. Turn on 2-Step Verification for your Google account.
2. Create an [App Password](https://support.google.com/accounts/answer/185833?hl=en).
3. Use that app password as `auth.pass`.

---

## Features

- 🔒 Fully dynamic credentials (no hardcoded SMTP)
- 🧾 HTML emails with attachments
- 🧪 Input validation with [Zod](https://zod.dev)
- 🚀 Optimized transport connection pooling
- 🧰 Developer-first API — clean and extensible

---

## Example with Attachments

```js
attachments: [
	{
		filename: "report.pdf",
		path: "./files/report.pdf",
	},
	{
		filename: "logo.png",
		path: "https://example.com/logo.png",
	},
];
```

---

## Coming Soon

- CLI: `senderwolf send ...`
- Template support (Handlebars, EJS)
- Webhook-ready version for serverless

---

## License

MIT © 2025 [Chandraprakash](https://github.com/Chandraprakash-03)

---
