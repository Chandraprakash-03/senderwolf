/**
 * Senderwolf Examples - Comprehensive usage examples
 * This file demonstrates all the ways to use senderwolf
 */

import {
    sendEmail,
    createMailer,
    quickSend,
    sendGmail,
    testConnection,
    listProviders,
    getProviderConfig
} from './index.js';

// ============================================================================
// 1. BASIC USAGE - Simple email sending
// ============================================================================

async function basicExample() {
    const result = await sendEmail({
        smtp: {
            provider: 'gmail', // Auto-configures Gmail SMTP settings
            auth: {
                user: 'your@gmail.com',
                pass: 'your-app-password'
            }
        },
        mail: {
            to: 'recipient@example.com',
            subject: 'Hello from Senderwolf!',
            html: '<h1>Hello World!</h1><p>This is a test email.</p>'
        }
    });

    console.log('Email sent:', result);
}

// ============================================================================
// 2. PROVIDER AUTO-DETECTION - No need to specify provider
// ============================================================================

async function autoDetectionExample() {
    const result = await sendEmail({
        smtp: {
            // Provider auto-detected from email domain
            auth: {
                user: 'your@outlook.com', // Will auto-use Outlook settings
                pass: 'your-password'
            }
        },
        mail: {
            to: 'recipient@example.com',
            subject: 'Auto-detected provider',
            text: 'Senderwolf automatically detected Outlook settings!'
        }
    });
}

// ============================================================================
// 3. MULTIPLE RECIPIENTS - TO, CC, BCC support
// ============================================================================

async function multipleRecipientsExample() {
    const result = await sendEmail({
        smtp: {
            provider: 'gmail',
            auth: { user: 'your@gmail.com', pass: 'your-app-password' }
        },
        mail: {
            to: ['recipient1@example.com', 'recipient2@example.com'],
            cc: 'manager@example.com',
            bcc: ['secret@example.com', 'audit@example.com'],
            subject: 'Team Update',
            html: '<p>This email goes to multiple recipients</p>'
        }
    });
}

// ============================================================================
// 4. CUSTOM SMTP PROVIDER - Use any SMTP server
// ============================================================================

async function customProviderExample() {
    const result = await sendEmail({
        smtp: {
            host: 'mail.your-domain.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'noreply@your-domain.com',
                pass: 'your-password',
                type: 'login' // or 'plain', 'oauth2', 'xoauth2'
            }
        },
        mail: {
            to: 'customer@example.com',
            subject: 'Welcome to our service',
            html: '<h1>Welcome!</h1>'
        }
    });
}

// ============================================================================
// 5. OAUTH2 AUTHENTICATION - For enhanced security
// ============================================================================

async function oauth2Example() {
    const result = await sendEmail({
        smtp: {
            provider: 'gmail',
            auth: {
                type: 'oauth2',
                user: 'your@gmail.com',
                clientId: 'your-client-id',
                clientSecret: 'your-client-secret',
                refreshToken: 'your-refresh-token',
                accessToken: 'your-access-token' // optional, will be refreshed
            }
        },
        mail: {
            to: 'recipient@example.com',
            subject: 'OAuth2 Authentication',
            text: 'This email was sent using OAuth2!'
        }
    });
}

// ============================================================================
// 6. ATTACHMENTS - Files, buffers, and streams
// ============================================================================

async function attachmentsExample() {
    const result = await sendEmail({
        smtp: {
            provider: 'gmail',
            auth: { user: 'your@gmail.com', pass: 'your-app-password' }
        },
        mail: {
            to: 'recipient@example.com',
            subject: 'Files attached',
            html: '<p>Please find the attached files.</p>',
            attachments: [
                // File path
                {
                    filename: 'document.pdf',
                    path: './files/document.pdf'
                },
                // Buffer
                {
                    filename: 'data.txt',
                    content: Buffer.from('Hello World!'),
                    contentType: 'text/plain'
                },
                // String content
                {
                    filename: 'info.json',
                    content: JSON.stringify({ message: 'Hello' }),
                    contentType: 'application/json'
                }
            ]
        }
    });
}

// ============================================================================
// 7. SIMPLE API - Easier than nodemailer
// ============================================================================

async function simpleApiExample() {
    // Create a reusable mailer
    const mailer = createMailer({
        smtp: {
            provider: 'gmail',
            auth: {
                user: 'your@gmail.com',
                pass: 'your-app-password'
            }
        },
        defaults: {
            fromName: 'My App',
            replyTo: 'support@myapp.com'
        }
    });

    // Send HTML email
    await mailer.sendHtml(
        'user@example.com',
        'Welcome!',
        '<h1>Welcome to our app!</h1>'
    );

    // Send text email
    await mailer.sendText(
        'user@example.com',
        'Password Reset',
        'Your password reset code is: 123456'
    );

    // Send with attachments
    await mailer.sendWithAttachments(
        'user@example.com',
        'Your Invoice',
        '<p>Please find your invoice attached.</p>',
        [{ filename: 'invoice.pdf', path: './invoice.pdf' }]
    );

    // Send bulk emails
    const recipients = ['user1@example.com', 'user2@example.com'];
    const results = await mailer.sendBulk(
        recipients,
        'Newsletter',
        '<h1>Monthly Newsletter</h1>'
    );
    console.log('Bulk send results:', results);
}

// ============================================================================
// 8. QUICK SEND FUNCTIONS - One-liners
// ============================================================================

async function quickSendExamples() {
    // Gmail shortcut
    await sendGmail(
        'your@gmail.com',
        'your-app-password',
        'recipient@example.com',
        'Quick Gmail',
        'This was sent with one function call!'
    );

    // Generic quick send
    await quickSend(
        'outlook',
        'your@outlook.com',
        'your-password',
        'recipient@example.com',
        'Quick Outlook',
        '<h1>Quick and easy!</h1>'
    );
}

// ============================================================================
// 9. ADVANCED FEATURES - Headers, priority, etc.
// ============================================================================

async function advancedFeaturesExample() {
    const result = await sendEmail({
        smtp: {
            provider: 'gmail',
            auth: { user: 'your@gmail.com', pass: 'your-app-password' }
        },
        mail: {
            to: 'recipient@example.com',
            subject: 'Advanced Email',
            html: '<h1>Advanced Features</h1>',
            priority: 'high',
            replyTo: 'noreply@example.com',
            headers: {
                'X-Custom-Header': 'Custom Value',
                'X-Mailer': 'Senderwolf v3.0'
            },
            messageId: '<custom-message-id@example.com>',
            date: new Date()
        }
    });
}

// ============================================================================
// 10. TESTING AND DEBUGGING
// ============================================================================

async function testingExample() {
    // List available providers
    const providers = listProviders();
    console.log('Available providers:', providers);

    // Get provider config
    const gmailConfig = getProviderConfig('gmail');
    console.log('Gmail config:', gmailConfig);

    // Test connection
    const testResult = await testConnection({
        smtp: {
            provider: 'gmail',
            auth: { user: 'your@gmail.com', pass: 'your-app-password' }
        }
    });
    console.log('Connection test:', testResult);

    // Debug mode
    await sendEmail({
        smtp: {
            provider: 'gmail',
            debug: true, // Enable debug logging
            auth: { user: 'your@gmail.com', pass: 'your-app-password' }
        },
        mail: {
            to: 'test@example.com',
            subject: 'Debug Test',
            text: 'This will show debug information'
        }
    });
}

// ============================================================================
// 11. ERROR HANDLING
// ============================================================================

async function errorHandlingExample() {
    try {
        const result = await sendEmail({
            smtp: {
                provider: 'gmail',
                auth: { user: 'invalid@gmail.com', pass: 'wrong-password' }
            },
            mail: {
                to: 'test@example.com',
                subject: 'This will fail',
                text: 'This email will not be sent'
            }
        });
    } catch (error) {
        console.error('Email failed:', error.message);

        // Handle specific error types
        if (error.message.includes('authentication')) {
            console.log('Authentication failed - check credentials');
        } else if (error.message.includes('connection')) {
            console.log('Connection failed - check network/firewall');
        }
    }
}

// ============================================================================
// 12. CONFIGURATION FILE USAGE
// ============================================================================

// Create .senderwolfrc.json in your project root:
/*
{
    "provider": "gmail",
    "user": "your@gmail.com",
    "pass": "your-app-password",
    "fromName": "My Application",
    "fromEmail": "your@gmail.com",
    "replyTo": "support@myapp.com"
}
*/

async function configFileExample() {
    // With config file, you only need to specify the email content
    const result = await sendEmail({
        mail: {
            to: 'user@example.com',
            subject: 'Using Config File',
            html: '<p>SMTP settings loaded from .senderwolfrc.json</p>'
        }
    });
}

// Export examples for testing
export {
    basicExample,
    autoDetectionExample,
    multipleRecipientsExample,
    customProviderExample,
    oauth2Example,
    attachmentsExample,
    simpleApiExample,
    quickSendExamples,
    advancedFeaturesExample,
    testingExample,
    errorHandlingExample,
    configFileExample
};