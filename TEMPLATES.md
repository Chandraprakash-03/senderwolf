# 📧 Email Templates System

Senderwolf includes a powerful email templates system that makes it easy to create, manage, and send templated emails with dynamic content.

## 🌟 Features

- **Template Engine**: Handlebars-like syntax with variable substitution
- **Conditional Rendering**: `{{#if}}`, `{{#unless}}` blocks
- **Loop Rendering**: `{{#each}}` for arrays
- **Built-in Templates**: Ready-to-use templates for common scenarios
- **Template Management**: Register, update, remove, and organize templates
- **File Storage**: Save/load templates from JSON files
- **Validation**: Automatic template syntax validation
- **Mailer Integration**: Seamless integration with existing senderwolf API
- **Bulk Sending**: Efficient bulk email sending with templates
- **TypeScript Support**: Full type definitions included

## 🚀 Quick Start

### Using Built-in Templates

```js
import { createMailer, previewTemplate } from "senderwolf";

const mailer = createMailer({
	smtp: {
		provider: "gmail",
		auth: { user: "your@gmail.com", pass: "app-password" },
	},
});

// Send welcome email using built-in template
await mailer.sendTemplate("welcome", "user@example.com", {
	appName: "My App",
	userName: "John Doe",
	verificationRequired: true,
	verificationUrl: "https://myapp.com/verify?token=abc123",
});
```

### Creating Custom Templates

```js
import { registerTemplate } from 'senderwolf';

// Register a custom template
registerTemplate('orderConfirmation', {
    subject: 'Order #{{orderNumber}} Confirmed',
    html: `
        <h1>Thank you {{customerName}}!</h1>
        <p>Your order #{{orderNumber}} has been confirmed.</p>
        <p>Total: ${{totalAmount}}</p>

        <h3>Items:</h3>
        <ul>
            {{#each items}}
            <li>{{this.name}} - ${{this.price}}</li>
            {{/each}}
        </ul>
    `,
    text: `
        Thank you {{customerName}}!
        Your order #{{orderNumber}} has been confirmed.
        Total: ${{totalAmount}}

        Items:
        {{#each items}}
        - {{this.name}} - ${{this.price}}
        {{/each}}
    `,
    description: 'Order confirmation email',
    category: 'ecommerce'
});

// Use the template
await mailer.sendTemplate('orderConfirmation', 'customer@example.com', {
    customerName: 'Jane Smith',
    orderNumber: 'ORD-12345',
    totalAmount: '99.99',
    items: [
        { name: 'Product A', price: '49.99' },
        { name: 'Product B', price: '49.99' }
    ]
});
```

## 📝 Template Syntax

### Variables

Use double curly braces for variable substitution:

```html
<h1>Hello {{userName}}!</h1>
<p>Welcome to {{appName}}.</p>
```

### Nested Properties

Access nested object properties with dot notation:

```html
<p>{{user.name}} ({{user.email}})</p>
<p>{{company.address.city}}, {{company.address.state}}</p>
```

### Conditional Rendering

#### If Blocks

```html
{{#if isPremium}}
<div class="premium-banner">
	<p>🌟 Premium Member Benefits</p>
</div>
{{/if}}
```

#### Unless Blocks

```html
{{#unless hasCompletedProfile}}
<div class="alert">
	<p>Please complete your profile.</p>
</div>
{{/unless}}
```

### Loop Rendering

Iterate over arrays with `{{#each}}`:

```html
<ul>
	{{#each items}}
	<li>{{this.name}} - ${{this.price}}</li>
	{{/each}}
</ul>
```

#### Loop Variables

Inside loops, you have access to special variables:

- `{{this}}` - Current item
- `{{@index}}` - Current index (0-based)
- `{{@first}}` - True if first item
- `{{@last}}` - True if last item

```html
{{#each users}}
<div class="user {{#if @first}}first{{/if}} {{#if @last}}last{{/if}}">
	<p>{{@index}}: {{this.name}}</p>
</div>
{{/each}}
```

## 🏗️ Built-in Templates

Senderwolf includes several ready-to-use templates:

### Welcome Template

```js
await mailer.sendTemplate("welcome", "user@example.com", {
	appName: "My App",
	userName: "John Doe",
	verificationRequired: true,
	verificationUrl: "https://myapp.com/verify?token=abc123",
});
```

**Variables**: `appName`, `userName`, `verificationRequired`, `verificationUrl`

### Password Reset Template

```js
await mailer.sendTemplate("passwordReset", "user@example.com", {
	appName: "My App",
	userName: "John Doe",
	resetUrl: "https://myapp.com/reset?token=xyz789",
	expirationTime: "30",
});
```

**Variables**: `appName`, `userName`, `resetUrl`, `expirationTime`

### Notification Template

```js
await mailer.sendTemplate("notification", "user@example.com", {
	title: "System Maintenance",
	userName: "John Doe",
	message: "Scheduled maintenance tonight 2-4 AM EST.",
	actionRequired: true,
	actionUrl: "https://myapp.com/maintenance",
	actionText: "View Details",
	senderName: "System Admin",
});
```

**Variables**: `title`, `userName`, `message`, `actionRequired`, `actionUrl`, `actionText`, `senderName`

### Invoice Template

```js
await mailer.sendTemplate("invoice", "customer@example.com", {
	invoiceNumber: "INV-001",
	companyName: "My Company",
	customerName: "Jane Smith",
	customerEmail: "jane@example.com",
	items: [
		{ description: "Consulting Services", amount: "500.00" },
		{ description: "Software License", amount: "200.00" },
	],
	totalAmount: "700.00",
	dueDate: "2025-02-15",
});
```

**Variables**: `invoiceNumber`, `companyName`, `customerName`, `customerEmail`, `items`, `totalAmount`, `dueDate`

## 🔧 Template Management

### Registration and Retrieval

```js
import {
	registerTemplate,
	getTemplate,
	listTemplates,
	removeTemplate,
} from "senderwolf";

// Register template
const template = registerTemplate("myTemplate", {
	subject: "Hello {{name}}",
	html: "<h1>Hello {{name}}!</h1>",
	description: "Simple greeting",
});

// Get template
const retrieved = getTemplate("myTemplate");

// List all templates
const allTemplates = listTemplates();

// List by category
const authTemplates = listTemplates("authentication");

// Remove template
removeTemplate("myTemplate");
```

### Template Categories

Organize templates by category:

```js
registerTemplate("welcome", {
	// ... template config
	category: "authentication",
});

registerTemplate("orderConfirmation", {
	// ... template config
	category: "ecommerce",
});

// Get all categories
const categories = TemplateManager.getCategories();
// ['authentication', 'ecommerce', 'notification', 'business']
```

### Template Validation

Templates are automatically validated when registered:

```js
try {
	registerTemplate("invalid", {
		subject: "Test {{unclosed", // Missing closing brace
		html: "<h1>{{#if condition}}</h1>", // Missing {{/if}}
	});
} catch (error) {
	console.log("Validation error:", error.message);
}

// Manual validation
const template = getTemplate("myTemplate");
const validation = template.validate();
if (!validation.valid) {
	console.log("Errors:", validation.errors);
}
```

## 💾 File Storage

### Save Templates to Files

```js
import { saveTemplateToFile, loadTemplateFromFile } from "senderwolf";

// Save single template
await saveTemplateToFile("myTemplate", "./templates/my-template.json");

// Load single template
const template = await loadTemplateFromFile("./templates/my-template.json");
```

### Batch Operations

```js
import { loadTemplatesFromDirectory } from "senderwolf";

// Load all templates from directory
const templates = await loadTemplatesFromDirectory("./templates");
console.log(`Loaded ${templates.length} templates`);
```

### Template File Format

Templates are stored as JSON:

```json
{
	"name": "welcome",
	"subject": "Welcome to {{appName}}!",
	"html": "<h1>Welcome {{userName}}!</h1>",
	"text": "Welcome {{userName}}!",
	"variables": ["appName", "userName"],
	"description": "Welcome email for new users",
	"category": "authentication",
	"created": "2025-01-15T10:00:00.000Z",
	"updated": "2025-01-15T10:00:00.000Z"
}
```

## 📧 Mailer Integration

### Template Methods

The `createMailer()` function returns a mailer with template methods:

```js
const mailer = createMailer({
	/* config */
});

// Send single template email
await mailer.sendTemplate("welcome", "user@example.com", variables);

// Send bulk template emails
await mailer.sendBulkTemplate("newsletter", recipients, variables);

// Preview template without sending
const preview = mailer.previewTemplate("welcome", variables);
console.log("Subject:", preview.subject);
console.log("HTML:", preview.html);
console.log("Text:", preview.text);
```

### Bulk Template Sending

Send the same template to multiple recipients:

```js
const recipients = [
	"user1@example.com",
	"user2@example.com",
	"user3@example.com",
];

// Same variables for all recipients
const results = await mailer.sendBulkTemplate("newsletter", recipients, {
	companyName: "My Company",
	month: "January",
});

// Different variables per recipient
const results = await mailer.sendBulkTemplate(
	"personalized",
	recipients,
	(recipient) => ({
		userName: getUserName(recipient),
		personalizedContent: getPersonalizedContent(recipient),
	})
);

// Check results
results.forEach((result) => {
	if (result.success) {
		console.log(`✅ Sent to ${result.recipient}: ${result.messageId}`);
	} else {
		console.log(`❌ Failed to send to ${result.recipient}: ${result.error}`);
	}
});
```

## 🎨 Advanced Usage

### Dynamic Template Selection

```js
function getTemplateForUser(user) {
	if (user.isPremium) {
		return "premiumWelcome";
	} else if (user.isTrialing) {
		return "trialWelcome";
	} else {
		return "welcome";
	}
}

const templateName = getTemplateForUser(user);
await mailer.sendTemplate(templateName, user.email, {
	userName: user.name,
	// ... other variables
});
```

### Template Inheritance

Create base templates and extend them:

```js
// Base template
registerTemplate("baseEmail", {
	html: `
        <div style="font-family: Arial, sans-serif;">
            <header>{{companyName}}</header>
            <main>{{content}}</main>
            <footer>© {{year}} {{companyName}}</footer>
        </div>
    `,
});

// Extended template
registerTemplate("productUpdate", {
	subject: "Product Update: {{productName}}",
	html: `
        <h1>{{productName}} Update</h1>
        <p>{{updateMessage}}</p>
        <a href="{{learnMoreUrl}}">Learn More</a>
    `,
	// Use base template wrapper
	variables: [
		"productName",
		"updateMessage",
		"learnMoreUrl",
		"companyName",
		"year",
	],
});
```

### Template Preprocessing

```js
import { TemplateEngine } from "senderwolf";

// Custom preprocessing
function preprocessTemplate(template, variables) {
	// Add computed variables
	const enhanced = {
		...variables,
		currentYear: new Date().getFullYear(),
		formattedDate: new Date().toLocaleDateString(),
		isWeekend: [0, 6].includes(new Date().getDay()),
	};

	return TemplateEngine.compile(template, enhanced);
}

// Use in custom template
const customHtml = preprocessTemplate(
	"<p>Today is {{formattedDate}} {{#if isWeekend}}(Weekend!){{/if}}</p>",
	{ userName: "John" }
);
```

## 🔍 Template Engine API

### TemplateEngine Class

```js
import { TemplateEngine } from "senderwolf";

// Compile template with variables
const compiled = TemplateEngine.compile(
	"Hello {{name}}! {{#if premium}}You are premium!{{/if}}",
	{ name: "John", premium: true }
);

// Extract variables from template
const variables = TemplateEngine.extractVariables(
	"Hello {{name}}! Your balance is {{account.balance}}"
);
// ['name', 'account.balance']
```

### EmailTemplate Class

```js
import { EmailTemplate } from "senderwolf";

// Create template instance
const template = new EmailTemplate("myTemplate", {
	subject: "Hello {{name}}",
	html: "<h1>Hello {{name}}!</h1>",
	description: "Greeting template",
});

// Render with variables
const rendered = template.render({ name: "John" });

// Validate template
const validation = template.validate();

// Convert to/from JSON
const json = template.toJSON();
const restored = EmailTemplate.fromJSON(json);
```

### TemplateManager Class

```js
import { TemplateManager } from "senderwolf";

// Register template
TemplateManager.registerTemplate("test", {
	/* config */
});

// Check if exists
const exists = TemplateManager.hasTemplate("test");

// Update template
TemplateManager.updateTemplate("test", {
	description: "Updated description",
});

// Get categories
const categories = TemplateManager.getCategories();

// Clear all templates
TemplateManager.clearAll();
```

## 🛠️ Best Practices

### 1. Template Organization

```js
// Organize by feature/category
registerTemplate("auth.welcome", { category: "authentication" });
registerTemplate("auth.passwordReset", { category: "authentication" });
registerTemplate("order.confirmation", { category: "ecommerce" });
registerTemplate("order.shipped", { category: "ecommerce" });
```

### 2. Variable Naming

```js
// Use clear, descriptive names
const variables = {
	userName: "John Doe", // ✅ Clear
	userEmail: "john@example.com", // ✅ Clear
	n: "John", // ❌ Unclear
	e: "john@example.com", // ❌ Unclear
};
```

### 3. Error Handling

```js
async function sendTemplateEmail(templateName, recipient, variables) {
	try {
		// Check if template exists
		if (!getTemplate(templateName)) {
			throw new Error(`Template '${templateName}' not found`);
		}

		// Validate variables
		const template = getTemplate(templateName);
		const missingVars = template.variables.filter((v) => !(v in variables));
		if (missingVars.length > 0) {
			console.warn(`Missing variables: ${missingVars.join(", ")}`);
		}

		// Send email
		const result = await mailer.sendTemplate(
			templateName,
			recipient,
			variables
		);
		return result;
	} catch (error) {
		console.error("Template email failed:", error.message);
		throw error;
	}
}
```

### 4. Template Testing

```js
// Test templates before sending
function testTemplate(templateName, testVariables) {
	const template = getTemplate(templateName);
	if (!template) {
		throw new Error(`Template '${templateName}' not found`);
	}

	// Validate syntax
	const validation = template.validate();
	if (!validation.valid) {
		throw new Error(
			`Template validation failed: ${validation.errors.join(", ")}`
		);
	}

	// Test rendering
	const rendered = template.render(testVariables);

	// Check for empty content
	if (!rendered.subject.trim()) {
		console.warn("Template has empty subject");
	}

	if (!rendered.html.trim() && !rendered.text.trim()) {
		console.warn("Template has no content");
	}

	return rendered;
}
```

### 5. Performance Optimization

```js
// Cache frequently used templates
const templateCache = new Map();

function getCachedTemplate(name) {
	if (!templateCache.has(name)) {
		const template = getTemplate(name);
		if (template) {
			templateCache.set(name, template);
		}
	}
	return templateCache.get(name);
}

// Use bulk operations for multiple emails
const recipients = ["user1@example.com", "user2@example.com"];
await mailer.sendBulkTemplate("newsletter", recipients, variables);
// ✅ More efficient than individual sends
```

## 🚨 Error Handling

Common errors and solutions:

### Template Not Found

```js
// Error: Template 'nonexistent' not found
const template = getTemplate("nonexistent");
if (!template) {
	console.log("Template not found, using fallback");
	// Use fallback template or create one
}
```

### Validation Errors

```js
// Error: Template validation failed: Subject template error: ...
try {
	registerTemplate("invalid", {
		subject: "Hello {{unclosed", // Missing }}
		html: "<h1>Test</h1>",
	});
} catch (error) {
	console.log("Fix template syntax:", error.message);
}
```

### Missing Variables

```js
// Variables referenced in template but not provided
const rendered = template.render({ name: "John" });
// If template uses {{email}}, it will be empty in output
// Always provide all required variables
```

## 📊 Monitoring and Analytics

Track template usage:

```js
const templateStats = new Map();

// Wrap sendTemplate to track usage
const originalSendTemplate = mailer.sendTemplate;
mailer.sendTemplate = async function (templateName, ...args) {
	// Track usage
	const count = templateStats.get(templateName) || 0;
	templateStats.set(templateName, count + 1);

	// Call original method
	return originalSendTemplate.call(this, templateName, ...args);
};

// View stats
console.log("Template usage:", Object.fromEntries(templateStats));
```

## 🔗 Integration Examples

### Express.js Integration

```js
import express from "express";
import { createMailer } from "senderwolf";

const app = express();
const mailer = createMailer({
	/* config */
});

app.post("/send-welcome", async (req, res) => {
	try {
		const { email, name } = req.body;

		await mailer.sendTemplate("welcome", email, {
			appName: "My App",
			userName: name,
			verificationRequired: true,
			verificationUrl: `${req.protocol}://${req.get(
				"host"
			)}/verify?email=${email}`,
		});

		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
```

### Database Integration

```js
// Store templates in database
class DatabaseTemplateManager {
	static async saveTemplate(template) {
		await db.templates.create({
			name: template.name,
			data: JSON.stringify(template.toJSON()),
		});
	}

	static async loadTemplate(name) {
		const record = await db.templates.findOne({ name });
		if (record) {
			const data = JSON.parse(record.data);
			return registerTemplate(name, data);
		}
		return null;
	}
}
```

## 🎯 Migration Guide

### From Plain HTML/Text

```js
// Before: Plain HTML
const html = `<h1>Welcome ${userName}!</h1>`;

// After: Template
registerTemplate("welcome", {
	subject: "Welcome!",
	html: "<h1>Welcome {{userName}}!</h1>",
});
```

### From Other Template Engines

```js
// From Handlebars
// Handlebars: {{#each users}}{{name}}{{/each}}
// Senderwolf: {{#each users}}{{this.name}}{{/each}}

// From Mustache
// Mustache: {{#users}}{{name}}{{/users}}
// Senderwolf: {{#each users}}{{this.name}}{{/each}}
```

## 📚 Additional Resources

- [Examples](./examples/templates-demo.js) - Comprehensive examples
- [API Reference](./types/index.d.ts) - TypeScript definitions
- [Built-in Templates](./lib/templates.js) - Source code for built-in templates

---

The Email Templates System makes senderwolf even more powerful for building email-driven applications. Start with the built-in templates and create your own as needed!
