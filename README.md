# senderwolf

> 🐺 The simplest way to send emails from your terminal — via Gmail or any SMTP.

**Senderwolf** is a tiny email-sending tool with both **CLI** and **JS support**. It lets you send HTML emails with attachments using Gmail SMTP or other providers.

---

## Install

```bash
npm install senderwolf -g
```

---

## Usage (CLI)

### Basic CLI Example

```bash
senderwolf --user your@gmail.com --pass yourapppass \
  --to someone@example.com \
  --subject "Hi there" \
  --html "<h1>Hello</h1>"
```

### Send an HTML file

```bash
senderwolf --user your@gmail.com --pass yourapppass \
  --to someone@example.com \
  --subject "Yo" \
  --html ./email.html
```

### With attachments

```bash
senderwolf --user your@gmail.com --pass yourapppass \
  --to someone@example.com \
  --subject "With files" \
  --html "<p>See attached</p>" \
  --attachments "./file.pdf,./logo.png"
```

---

## Interactive Mode

use `--interactive`:

```bash
senderwolf --interactive
```

You'll be prompted for all the fields step-by-step.

---

## Dry Run

Preview the SMTP config and email content without sending:

```bash
senderwolf --dry-run ...
```

---

## Usage in Code

```js
import { sendEmail } from "senderwolf";

await sendEmail({
	smtp: {
		auth: {
			user: "your@gmail.com",
			pass: "your-app-password",
		},
	},
	mail: {
		to: "target@example.com",
		subject: "Hello!",
		html: "<h1>Hi there</h1>",
		attachments: [{ filename: "file.pdf", path: "./file.pdf" }],
	},
});
```

---

## Notes

- Requires a **Gmail App Password** (not your main login password).
- Supports Gmail and other SMTP hosts like Outlook, Zoho, etc.

---

## License

MIT © 2025 [Chandraprakash](https://github.com/Chandraprakash-03)
