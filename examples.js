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

// ============================================================================
// 12. EMAIL TEMPLATES - Template-based email sending
// ============================================================================

async function templateExamples() {
    console.log('\n📧 Email Templates Examples\n');

    // Create mailer for template examples
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
            fromEmail: 'your@gmail.com'
        }
    });

    // Example 1: Using built-in welcome template
    console.log('1. Built-in Welcome Template:');
    try {
        const result = await mailer.sendTemplate('welcome', 'user@example.com', {
            appName: 'My Awesome App',
            userName: 'John Doe',
            verificationRequired: true,
            verificationUrl: 'https://myapp.com/verify?token=abc123'
        });
        console.log('✅ Welcome email sent:', result.messageId);
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Example 2: Using built-in password reset template
    console.log('\n2. Built-in Password Reset Template:');
    try {
        const result = await mailer.sendTemplate('passwordReset', 'user@example.com', {
            appName: 'My Awesome App',
            userName: 'John Doe',
            resetUrl: 'https://myapp.com/reset?token=xyz789',
            expirationTime: '30'
        });
        console.log('✅ Password reset email sent:', result.messageId);
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Example 3: Creating and using custom template
    console.log('\n3. Custom Template:');
    try {
        // Register custom template
        registerTemplate('orderConfirmation', {
            subject: 'Order #{{orderNumber}} Confirmed - {{companyName}}',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #28a745;">Order Confirmed!</h1>
                    <p>Hi {{customerName}},</p>
                    <p>Thank you for your order! Here are the details:</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>Order #{{orderNumber}}</h3>
                        <p><strong>Date:</strong> {{orderDate}}</p>
                        <p><strong>Total:</strong> ${{ totalAmount }}</p>
                    </div>
                    
                    <h4>Items:</h4>
                    <ul>
                        {{#each items}}
                        <li>{{this.name}} - Qty: {{this.quantity}} - ${{ this.price }}</li>
                        {{/each}}
                    </ul>
                    
                    {{#if shippingAddress}}
                    <h4>Shipping Address:</h4>
                    <p>{{shippingAddress}}</p>
                    {{/if}}
                    
                    <p>We'll send you tracking information once your order ships.</p>
                    <p>Best regards,<br>{{companyName}} Team</p>
                </div>
            `,
            text: `
                Order Confirmed!
                
                Hi {{customerName}},
                
                Thank you for your order! Here are the details:
                
                Order #{{orderNumber}}
                Date: {{orderDate}}
                Total: ${{ totalAmount }}
                
                Items:
                {{#each items}}
                - {{this.name}} - Qty: {{this.quantity}} - ${{ this.price }}
                {{/each}}
                
                {{#if shippingAddress}}
                Shipping Address:
                {{shippingAddress}}
                {{/if}}
                
                We'll send you tracking information once your order ships.
                
                Best regards,
                {{companyName}} Team
            `,
            description: 'Order confirmation email',
            category: 'ecommerce'
        });

        // Use the custom template
        const result = await mailer.sendTemplate('orderConfirmation', 'customer@example.com', {
            customerName: 'Jane Smith',
            orderNumber: 'ORD-12345',
            orderDate: '2025-01-15',
            totalAmount: '149.99',
            companyName: 'Demo Store',
            shippingAddress: '123 Main St, Anytown, ST 12345',
            items: [
                { name: 'Wireless Headphones', quantity: 1, price: '99.99' },
                { name: 'Phone Case', quantity: 2, price: '25.00' }
            ]
        });
        console.log('✅ Order confirmation sent:', result.messageId);
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Example 4: Template preview (without sending)
    console.log('\n4. Template Preview:');
    try {
        const preview = mailer.previewTemplate('notification', {
            title: 'System Maintenance Notice',
            userName: 'John Doe',
            message: 'We will be performing scheduled maintenance tonight from 2-4 AM EST.',
            actionRequired: true,
            actionUrl: 'https://example.com/maintenance',
            actionText: 'View Details',
            senderName: 'System Admin'
        });

        console.log('Subject:', preview.subject);
        console.log('HTML Preview (first 200 chars):', preview.html.substring(0, 200) + '...');
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Example 5: Bulk template sending
    console.log('\n5. Bulk Template Sending:');
    try {
        const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

        // Send same template to multiple recipients with different variables
        const results = await mailer.sendBulkTemplate('notification', recipients, (recipient) => ({
            title: 'Welcome to Our Newsletter',
            userName: `User ${recipients.indexOf(recipient) + 1}`,
            message: `Welcome to our newsletter! You're receiving this at ${recipient}.`,
            actionRequired: true,
            actionUrl: 'https://example.com/welcome',
            actionText: 'Get Started',
            senderName: 'Newsletter Team'
        }));

        results.forEach(result => {
            if (result.success) {
                console.log(`✅ Sent to ${result.recipient}: ${result.messageId}`);
            } else {
                console.log(`❌ Failed to send to ${result.recipient}: ${result.error}`);
            }
        });
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Example 6: List available templates
    console.log('\n6. Available Templates:');
    const templates = listTemplates();
    console.log('All templates:');
    templates.forEach(template => {
        console.log(`  - ${template.name} (${template.category}): ${template.description}`);
    });

    // List by category
    console.log('\nAuthentication templates:');
    const authTemplates = listTemplates('authentication');
    authTemplates.forEach(template => {
        console.log(`  - ${template.name}: ${template.description}`);
    });

    // Example 7: Template with conditional content
    console.log('\n7. Conditional Template:');
    try {
        registerTemplate('conditionalWelcome', {
            subject: 'Welcome{{#if isPremium}} Premium{{/if}} User!',
            html: `
                <h1>Welcome {{userName}}!</h1>
                
                {{#if isPremium}}
                <div style="background: gold; padding: 15px; border-radius: 5px;">
                    <h3>🌟 Premium Member Benefits</h3>
                    <ul>
                        <li>Priority Support</li>
                        <li>Advanced Features</li>
                        <li>Monthly Reports</li>
                    </ul>
                </div>
                {{/if}}
                
                {{#unless hasCompletedProfile}}
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 15px;">
                    <p>⚠️ Please complete your profile to get started.</p>
                    <a href="{{profileUrl}}" style="background: #007bff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 3px;">Complete Profile</a>
                </div>
                {{/unless}}
                
                <h3>Your Benefits:</h3>
                <ul>
                    {{#each benefits}}
                    <li>{{this}}</li>
                    {{/each}}
                </ul>
            `,
            description: 'Welcome email with conditional content',
            category: 'authentication'
        });

        // Test with premium user
        const premiumPreview = previewTemplate('conditionalWelcome', {
            userName: 'Alice Premium',
            isPremium: true,
            hasCompletedProfile: true,
            profileUrl: 'https://example.com/profile',
            benefits: ['Priority Support', 'Advanced Features', 'Monthly Reports']
        });
        console.log('Premium user subject:', premiumPreview.subject);

        // Test with regular user
        const regularPreview = previewTemplate('conditionalWelcome', {
            userName: 'Bob Regular',
            isPremium: false,
            hasCompletedProfile: false,
            profileUrl: 'https://example.com/profile',
            benefits: ['Basic Support', 'Standard Features']
        });
        console.log('Regular user subject:', regularPreview.subject);
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    console.log('\n✅ Template examples completed!');
}

// ============================================================================
// 13. TEMPLATE MANAGEMENT - File operations and advanced features
// ============================================================================

async function templateManagementExamples() {
    console.log('\n🗂️ Template Management Examples\n');

    try {
        // Example 1: Save template to file
        console.log('1. Saving template to file:');
        const { saveTemplateToFile } = await import('./index.js');

        // Register a template first
        registerTemplate('emailTemplate', {
            subject: 'Sample Template',
            html: '<h1>Hello {{name}}!</h1>',
            description: 'Sample template for demo'
        });

        // Save to file (in real usage, you'd use a proper path)
        try {
            await saveTemplateToFile('emailTemplate', './sample-template.json');
            console.log('✅ Template saved to file');
        } catch (error) {
            console.log('⚠️ File save demo skipped:', error.message);
        }

        // Example 2: Template validation
        console.log('\n2. Template validation:');
        const { getTemplate } = await import('./index.js');
        const template = getTemplate('emailTemplate');
        if (template) {
            const validation = template.validate();
            console.log(`Template validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);
            if (!validation.valid) {
                validation.errors.forEach(error => console.log(`  - ${error}`));
            }
        }

        // Example 3: Template categories
        console.log('\n3. Template categories:');
        const { TemplateManager } = await import('./index.js');
        const categories = TemplateManager.getCategories();
        console.log('Available categories:', categories.join(', '));

        // Clean up
        const { removeTemplate } = await import('./index.js');
        removeTemplate('emailTemplate');

    } catch (error) {
        console.log('❌ Template management error:', error.message);
    }
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
    console.log('🐺 Senderwolf Comprehensive Examples\n');
    console.log('Note: These examples use placeholder credentials.');
    console.log('Replace with your actual SMTP settings to send real emails.\n');

    try {
        // Run template examples
        await templateExamples();
        await templateManagementExamples();

        console.log('\n🎉 All examples completed!');
        console.log('\n📚 Key Features Demonstrated:');
        console.log('  ✅ Built-in email templates (welcome, passwordReset, notification, invoice)');
        console.log('  ✅ Custom template creation with handlebars-like syntax');
        console.log('  ✅ Variable substitution and conditional rendering');
        console.log('  ✅ Template preview without sending emails');
        console.log('  ✅ Bulk template sending with per-recipient variables');
        console.log('  ✅ Template management and file operations');
        console.log('  ✅ Template validation and error handling');

    } catch (error) {
        console.error('❌ Example failed:', error.message);
    }
}

// Export the new functions
export {
    templateExamples,
    templateManagementExamples,
    runAllExamples
};