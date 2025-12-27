# 📋 Changelog

All notable changes to Senderwolf will be documented in this file.

## [3.3.0] - 2025-01-27

### ✨ What's New

- **🔷 Complete TypeScript Support** - Full type definitions with IntelliSense
- **📧 Advanced Template System** - 4 built-in templates with variable substitution
- **🔧 Template CLI Tool** - Complete command-line interface for template management
- **⚡ Enhanced Connection Pooling** - 50-80% faster bulk email sending
- **📊 Pool Statistics** - Real-time monitoring with `getPoolStats()`
- **🛡️ Rate Limiting** - Built-in protection against provider limits
- **🎨 Template Engine** - Support for conditionals, loops, and nested variables
- **💾 Template File Operations** - Save/load templates from JSON files
- **🔍 Template Validation** - Syntax checking and error reporting
- **📝 Template Categories** - Organized templates by use case
- **🚀 Bulk Template Sending** - Send templated emails to multiple recipients
- **🎯 Template Preview** - Preview rendered templates before sending
- **13+ Built-in Email Providers** - Gmail, Outlook, SendGrid, and more
- **🔍 Auto Provider Detection** - Automatic SMTP configuration from email address
- **⚙️ Runtime Provider Registration** - Add custom providers dynamically
- **🔐 OAuth 2 & XOAUTH2 Support** - Modern authentication methods
- **📬 CC/BCC Recipients** - Multiple recipient types support
- **⚡ Email Priority Levels** - High, normal, and low priority emails
- **📋 Custom Headers Support** - Add custom email headers
- **🔒 STARTTLS Support** - Secure email transmission
- **🧪 Connection Testing** - Verify SMTP settings before sending
- **📦 Bulk Emailing** - Efficient mass email sending with pooling
- **🎯 Simple API Methods** - One-liner functions for common tasks
- **🔧 Enhanced CLI** - Interactive mode and comprehensive options
- **🐛 Debug Mode** - Detailed logging for troubleshooting

### 🛠️ Improvements

- **📝 Better Error Messages** - More descriptive and actionable error reporting
- **✅ Enhanced Validation** - Comprehensive input validation and sanitization
- **📚 Improved Documentation** - Complete examples and usage guides
- **🏗️ Extensible Architecture** - Easy to add new providers and features
- **🎨 Template System Architecture** - Modular and extensible template engine
- **🔧 CLI User Experience** - Interactive prompts and better help text
- **⚡ Performance Optimizations** - Faster email processing and connection handling
- **🛡️ Security Enhancements** - Better credential handling and validation
- **📊 Monitoring Capabilities** - Pool statistics and performance metrics
- **🔍 Provider Discovery** - SMTP setting suggestions for unknown domains

### 🔁 Backward Compatibility

- **✅ Full v3.0.0 Compatibility** - All existing code continues to work
- **🔧 CLI Compatibility** - Existing CLI commands remain unchanged
- **⚙️ Configuration Compatibility** - All configuration formats supported
- **📦 API Compatibility** - No breaking changes to existing functions
- **🔌 Provider Compatibility** - All existing providers continue to work

### 🆕 New Functions & Methods

#### Template System

- `registerTemplate(name, config)` - Register custom templates
- `getTemplate(name)` - Retrieve template by name
- `listTemplates(category?)` - List all or filtered templates
- `removeTemplate(name)` - Remove template from registry
- `previewTemplate(name, variables)` - Preview rendered template
- `TemplateEngine.compile(template, variables)` - Direct template compilation
- `EmailTemplate` class - Template object with validation
- `TemplateManager` class - Template registry management

#### Enhanced Mailer

- `mailer.sendTemplate(templateName, to, variables)` - Send templated email
- `mailer.sendBulkTemplate(templateName, recipients, variables)` - Bulk template sending
- `mailer.previewTemplate(templateName, variables)` - Preview template
- `mailer.getStats()` - Get mailer-specific statistics

#### Pool Management

- `getPoolStats()` - Get connection pool statistics
- `closeAllPools()` - Close all active connection pools

#### Provider Management

- `suggestSMTPSettings(domain)` - Get SMTP suggestions for domain
- `getAllProviders()` - Get all registered providers
- `hasProvider(name)` - Check if provider exists

### 🔧 CLI Enhancements

#### New `senderwolf-templates` CLI

- `list` - List all available templates
- `show <name>` - Show template details
- `preview <name>` - Preview template with sample data
- `create` - Create new template interactively
- `load <path>` - Load template from file
- `save <name> <path>` - Save template to file
- `remove <name>` - Remove template
- `validate <name>` - Validate template syntax

#### Enhanced `senderwolf` CLI

- `--interactive` - Interactive email composition
- `--dry-run` - Preview email without sending
- `--suggest <domain>` - Get SMTP suggestions
- `--config-example` - Show configuration examples
- `--debug` - Enable detailed logging

### 📦 Built-in Templates

1. **Welcome** - User onboarding emails
2. **Password Reset** - Account recovery emails
3. **Notification** - General notification emails
4. **Invoice** - Business invoice emails

### 🔷 TypeScript Features

- **Complete Type Definitions** - Full IntelliSense support
- **Generic Types** - Type-safe template variables
- **Interface Definitions** - All configuration objects typed
- **Enum Types** - Provider names, priorities, auth types
- **JSDoc Documentation** - Rich tooltips in IDEs
- **Compile-time Validation** - Catch errors before runtime

### 🐛 Bug Fixes

- Fixed connection pool cleanup on process exit
- Improved error handling for invalid SMTP configurations
- Fixed template variable extraction for nested properties
- Enhanced CLI argument parsing and validation
- Resolved memory leaks in connection pooling
- Fixed provider detection for custom domains

### 📚 Documentation Updates

- Added comprehensive template system guide
- Enhanced CLI documentation with examples
- Added TypeScript usage examples
- Updated provider configuration examples
- Added troubleshooting guide
- Enhanced API reference documentation

---

## [3.2.0] - 2024-12-15

### ✨ What's New

- **🚀 Built-in Connection Pooling** - 50-80% faster bulk email sending
- **⚡ High Performance** - Efficient connection reuse and management
- **🔄 Automatic Pool Management** - Smart connection rotation and cleanup
- **📊 Pool Monitoring** - Real-time statistics
- **🛡️ Rate Limiting** - Built-in protection against provider limits

### 🛠️ Improvements

- Enhanced bulk email performance
- Better connection management
- Improved error handling

### 🔁 Backward Compatibility

- Full v3.1.0 compatibility maintained
- No breaking changes

---

## [3.1.0] - 2024-11-20

### ✨ What's New

- Enhanced provider detection
- Improved CLI interface
- Better error messages

### 🛠️ Improvements

- Performance optimizations
- Documentation updates
- Code quality improvements

---

## [3.0.0] - 2024-10-15

### ✨ What's New

- Complete rewrite with modern Node.js
- 13+ built-in email providers
- Auto provider detection
- Enhanced CLI tools
- Comprehensive documentation

### 🛠️ Improvements

- Better architecture
- Improved performance
- Enhanced security

### 💥 Breaking Changes

- Requires Node.js 16+
- New API structure
- Updated configuration format

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © 2025 [Chandraprakash](https://github.com/Chandraprakash-03)
