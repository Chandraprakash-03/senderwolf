# senderwolf

> 🐺 Standalone SMTP library - send emails without nodemailer or any third-party SMTP dependencies.

**Senderwolf** is a lightweight email-sending tool with both **CLI** and **JS support**.  
Built with native Node.js modules, it sends HTML/text emails with attachments using Gmail SMTP or any SMTP provider.

**✨ v3.0.0 - Now completely standalone!** No more nodemailer dependency - pure Node.js implementation.

---

## Install

```bash
npm install senderwolf -g
```

---

## Usage (CLI)

### Basic CLI Example

```bash
senderwolf --user your@gmail.com --pass yourapppass   --to someone@example.com   --subject "Hi there"   --html "<h1>Hello</h1>"
```

### Send an HTML file

```bash
senderwolf --user your@gmail.com --pass yourapppass   --to someone@example.com   --subject "Yo"   --html ./email.html
```

### With attachments

```bash
senderwolf --user your@gmail.com --pass yourapppass   --to someone@example.com   --subject "With files"   --html "<p>See attached</p>"   --attachments "./file.pdf,./logo.png"
```

---

## Config File Support (v2.0.4+)

You can avoid typing your SMTP credentials every time by creating a config file.  
Senderwolf looks for `.senderwolfrc.json` in your **project root** (and falls back to your home directory).

### Example `.senderwolfrc.json`

```json
{
	"user": "your@gmail.com",
	"pass": "your-app-password",
	"host": "smtp.gmail.com",
	"port": 465,
	"secure": true,
	"fromName": "Senderwolf",
	"fromEmail": "your@gmail.com"
}
```

Now you can send emails without retyping credentials:

```bash
senderwolf -t someone@example.com -s "Hello" -x "Email sent using config 🎉"
```

### CLI flags override config values.

```bash
senderwolf -t person@example.com -s "Custom Sender" -n "Alice"
```

---

## Interactive Mode

Use `--interactive`:

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

- Requires a **Gmail App Password** (not your main login password for Gmail).
- Supports Gmail and other SMTP hosts like Outlook, Zoho, Mailtrap, etc.
- Config file makes repeated usage much simpler.

---

## License

MIT © 2025 [Chandraprakash](https://github.com/Chandraprakash-03)
