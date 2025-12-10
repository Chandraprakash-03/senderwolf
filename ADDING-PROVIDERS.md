# Adding New SMTP Providers to Senderwolf

Senderwolf is designed to be easily extensible for any SMTP provider. Here are all the ways to add support for new email services:

## 🚀 Quick Methods

### 1. Runtime Registration (Immediate)

```js
import { registerProvider, sendEmail } from "senderwolf";

// Register a new provider
registerProvider("newservice", {
	host: "smtp.newservice.com",
	port: 587,
	secure: false,
	requireTLS: true,
	name: "New Email Service",
});

// Use it immediately
await sendEmail({
	smtp: {
		provider: "newservice",
		auth: { user: "user@newservice.com", pass: "password" },
	},
	mail: {
		to: "recipient@example.com",
		subject: "Hello from new provider!",
		html: "<h1>It works!</h1>",
	},
});
```

### 2. Configuration File (Persistent)

Create or update `.senderwolfrc.json`:

```json
{
	"user": "your@gmail.com",
	"pass": "your-app-password",
	"customProviders": {
		"mycompany": {
			"host": "smtp.mycompany.com",
			"port": 587,
			"secure": false,
			"requireTLS": true,
			"name": "My Company SMTP"
		},
		"newservice": {
			"host": "mail.newservice.io",
			"port": 465,
			"secure": true,
			"name": "New Service SMTP"
		}
	},
	"customDomains": {
		"mycompany.com": "mycompany",
		"newservice.io": "newservice"
	}
}
```

Now these providers are available automatically when senderwolf loads!

## 🔧 Advanced Configuration

### Provider Configuration Options

```js
registerProvider("provider-name", {
	// Required
	host: "smtp.provider.com",

	// Optional (with defaults)
	port: 587, // Default: 587
	secure: false, // Default: false
	requireTLS: true, // Default: true
	name: "Provider Display Name", // Default: auto-generated

	// Advanced options
	connectionTimeout: 60000, // Default: 60000ms
	greetingTimeout: 30000, // Default: 30000ms
	socketTimeout: 60000, // Default: 60000ms
});
```

### Domain Auto-Detection

```js
import { registerDomain } from "senderwolf";

// Map domains to providers for auto-detection
registerDomain("company.com", "mycompany");
registerDomain("newservice.io", "newservice");

// Now emails from these domains auto-use the right provider
await sendEmail({
	smtp: {
		auth: { user: "admin@company.com", pass: "password" },
		// No provider needed - auto-detected!
	},
	mail: {
		/* ... */
	},
});
```

## 🌐 Real-World Examples

### Popular New Providers

```js
// Resend
registerProvider("resend", {
	host: "smtp.resend.com",
	port: 587,
	secure: false,
	requireTLS: true,
});

// Loops
registerProvider("loops", {
	host: "smtp.loops.so",
	port: 587,
	secure: false,
	requireTLS: true,
});

// Plunk
registerProvider("plunk", {
	host: "smtp.useplunk.com",
	port: 587,
	secure: false,
	requireTLS: true,
});
```

### Corporate Email Systems

```js
// Microsoft Exchange
registerProvider("exchange", {
	host: "mail.company.com",
	port: 587,
	secure: false,
	requireTLS: true,
});

// Custom corporate SMTP
registerProvider("corpmail", {
	host: "smtp.internal.company.com",
	port: 25,
	secure: false,
	requireTLS: false,
});
```

### Regional Providers

```js
// European provider
registerProvider("europrovider", {
	host: "smtp.europrovider.eu",
	port: 465,
	secure: true,
});

// Asian provider
registerProvider("asiaprovider", {
	host: "mail.asiaprovider.asia",
	port: 587,
	secure: false,
	requireTLS: true,
});
```

## 🔍 Discovery & Suggestions

### Get SMTP Suggestions for Unknown Domains

```js
import { suggestSMTPSettings } from "senderwolf";

const suggestions = suggestSMTPSettings("newcompany.com");
console.log(suggestions);
// Output:
// {
//   suggestions: [
//     'smtp.newcompany.com',
//     'mail.newcompany.com',
//     'smtp.mail.newcompany.com',
//     'outgoing.newcompany.com'
//   ],
//   commonPorts: [587, 465, 25, 2525],
//   note: 'These are common patterns. Check your email provider\'s documentation for exact settings.'
// }
```

### Check Provider Availability

```js
import { hasProvider, listProviders } from "senderwolf";

console.log(hasProvider("gmail")); // true
console.log(hasProvider("newservice")); // true (if registered)
console.log(hasProvider("unknown")); // false

console.log(listProviders()); // Array of all providers
```

## 📝 Contributing Built-in Providers

To add a provider permanently to senderwolf:

1. **Edit `lib/providers.js`**:

   ```js
   // Add to SMTP_PROVIDERS object
   newprovider: {
       host: "smtp.newprovider.com",
       port: 587,
       secure: false,
       requireTLS: true,
       name: "New Provider SMTP",
   },
   ```

2. **Add domain mapping** (if applicable):

   ```js
   // Add to DOMAIN_MAP object
   'newprovider.com': 'newprovider',
   ```

3. **Update documentation** and submit a pull request!

## 🛠️ Utility Functions

```js
import {
	registerProvider,
	unregisterProvider,
	registerDomain,
	getAllProviders,
	suggestSMTPSettings,
} from "senderwolf";

// Register provider
registerProvider("test", { host: "smtp.test.com" });

// Remove provider
unregisterProvider("test");

// Get all provider configs (for debugging)
console.log(getAllProviders());

// Register domain mapping
registerDomain("test.com", "test");

// Get suggestions for unknown domains
console.log(suggestSMTPSettings("unknown.com"));
```

## 🔐 Authentication Support

All registered providers support multiple authentication methods:

```js
// Basic authentication (default)
auth: {
    user: 'user@provider.com',
    pass: 'password',
    type: 'login' // or 'plain'
}

// OAuth2
auth: {
    type: 'oauth2',
    user: 'user@provider.com',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    refreshToken: 'your-refresh-token'
}

// XOAUTH2
auth: {
    type: 'xoauth2',
    user: 'user@provider.com',
    accessToken: 'your-access-token'
}
```

## 🎯 Best Practices

1. **Use descriptive provider names**: `mycompany` instead of `mc`
2. **Include display names**: Makes debugging easier
3. **Test with different auth methods**: Not all providers support all methods
4. **Document custom providers**: Add comments in your config files
5. **Use configuration files**: For persistent provider registration
6. **Check provider documentation**: For exact SMTP settings

## 🚨 Troubleshooting

### Common Issues

1. **Wrong port/security settings**:

   ```js
   // Try different combinations
   { port: 587, secure: false, requireTLS: true }  // Most common
   { port: 465, secure: true, requireTLS: false }  // SSL
   { port: 25, secure: false, requireTLS: false }  // Unencrypted
   ```

2. **Authentication failures**:

   - Check if provider requires app passwords
   - Try different auth types (`login`, `plain`, `oauth2`)
   - Verify credentials are correct

3. **Connection timeouts**:
   ```js
   registerProvider("slow-provider", {
   	host: "smtp.slow.com",
   	connectionTimeout: 120000, // Increase timeout
   	greetingTimeout: 60000,
   	socketTimeout: 120000,
   });
   ```

### Debug Mode

```js
await sendEmail({
	smtp: {
		provider: "newprovider",
		debug: true, // Enable debug logging
		auth: {
			/* ... */
		},
	},
	mail: {
		/* ... */
	},
});
```

## 📚 Examples Repository

Check out `new-provider-examples.js` for complete working examples of:

- Runtime provider registration
- Configuration file usage
- Domain mapping
- Error handling
- Real-world provider setups

---

**Need help?** Open an issue on GitHub with your provider details and we'll help you get it working!
