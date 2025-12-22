/**
 * Connection Pooling Examples for Senderwolf
 * Demonstrates how to use connection pooling for better performance
 */

import {
    sendEmail,
    createMailer,
    closeAllPools,
    getPoolStats
} from '../index.js';

// Example 1: Basic pooled email sending
async function basicPooledExample() {
    console.log('=== Basic Pooled Email Example ===');

    const result = await sendEmail({
        smtp: {
            provider: 'gmail',
            usePool: true, // Enable connection pooling
            pool: {
                maxConnections: 5,    // Max concurrent connections
                maxMessages: 100,     // Max messages per connection
                rateDelta: 1000,      // Rate limiting window (ms)
                rateLimit: 3,         // Max messages per rateDelta
                idleTimeout: 30000    // Connection idle timeout (ms)
            },
            auth: {
                user: 'your@gmail.com',
                pass: 'your-app-password'
            }
        },
        mail: {
            to: 'recipient@example.com',
            subject: 'Pooled Email Test',
            html: '<h1>This email was sent using connection pooling!</h1>'
        }
    });

    console.log('Email sent:', result.success ? 'Success' : 'Failed');
    if (result.messageId) console.log('Message ID:', result.messageId);
}

// Example 2: High-performance bulk sending with pooling
async function bulkSendingExample() {
    console.log('\n=== Bulk Sending with Connection Pooling ===');

    const mailer = createMailer({
        smtp: {
            provider: 'gmail',
            // usePool is enabled by default for createMailer
            pool: {
                maxConnections: 10,   // Higher for bulk sending
                maxMessages: 50,      // Lower to rotate connections
                rateLimit: 5          // Higher rate limit
            },
            auth: {
                user: 'your@gmail.com',
                pass: 'your-app-password'
            }
        },
        defaults: {
            fromName: 'Bulk Sender',
            subject: 'Newsletter'
        }
    });

    const recipients = [
        'user1@example.com',
        'user2@example.com',
        'user3@example.com',
        'user4@example.com',
        'user5@example.com'
    ];

    console.log(`Sending to ${recipients.length} recipients...`);
    const startTime = Date.now();

    // This will use connection pooling for efficient bulk sending
    const results = await mailer.sendBulk(
        recipients,
        'Monthly Newsletter',
        '<h1>Welcome to our newsletter!</h1><p>This month\'s updates...</p>'
    );

    const endTime = Date.now();
    const successful = results.filter(r => r.success).length;

    console.log(`Sent ${successful}/${recipients.length} emails in ${endTime - startTime}ms`);
    console.log('Results:', results);

    // Get pool statistics
    console.log('\nPool Statistics:', mailer.getStats());
}

// Example 3: Custom pool configuration for different use cases
async function customPoolConfigExample() {
    console.log('\n=== Custom Pool Configuration Examples ===');

    // High-volume configuration
    const highVolumeConfig = {
        smtp: {
            provider: 'sendgrid',
            usePool: true,
            pool: {
                maxConnections: 20,   // Many connections
                maxMessages: 200,     // Many messages per connection
                rateDelta: 1000,      // 1 second window
                rateLimit: 10,        // 10 emails per second
                idleTimeout: 60000    // 1 minute idle timeout
            },
            auth: {
                user: 'apikey',
                pass: 'your-sendgrid-api-key'
            }
        }
    };

    // Low-volume, reliable configuration
    const reliableConfig = {
        smtp: {
            provider: 'gmail',
            usePool: true,
            pool: {
                maxConnections: 2,    // Few connections
                maxMessages: 10,      // Rotate connections frequently
                rateDelta: 2000,      // 2 second window
                rateLimit: 1,         // 1 email per 2 seconds
                idleTimeout: 10000    // 10 second idle timeout
            },
            auth: {
                user: 'your@gmail.com',
                pass: 'your-app-password'
            }
        }
    };

    console.log('High-volume config:', highVolumeConfig.smtp.pool);
    console.log('Reliable config:', reliableConfig.smtp.pool);
}

// Example 4: Pool monitoring and management
async function poolManagementExample() {
    console.log('\n=== Pool Management Example ===');

    const mailer = createMailer({
        smtp: {
            provider: 'gmail',
            auth: {
                user: 'your@gmail.com',
                pass: 'your-app-password'
            }
        }
    });

    // Send a few emails to create pool activity
    for (let i = 0; i < 3; i++) {
        await mailer.sendHtml(
            'test@example.com',
            `Test Email ${i + 1}`,
            `<p>This is test email number ${i + 1}</p>`
        );
    }

    // Monitor pool statistics
    console.log('Current pool stats:', getPoolStats());

    // Graceful shutdown - close all pools
    console.log('Closing all connection pools...');
    await closeAllPools();
    console.log('All pools closed.');
}

// Example 5: Disable pooling for single emails
async function disablePoolingExample() {
    console.log('\n=== Disable Pooling Example ===');

    const result = await sendEmail({
        smtp: {
            provider: 'gmail',
            usePool: false, // Disable pooling for this email
            auth: {
                user: 'your@gmail.com',
                pass: 'your-app-password'
            }
        },
        mail: {
            to: 'recipient@example.com',
            subject: 'Non-pooled Email',
            text: 'This email was sent without connection pooling.'
        }
    });

    console.log('Non-pooled email result:', result);
}

// Run examples (uncomment to test)
async function runExamples() {
    try {
        // await basicPooledExample();
        // await bulkSendingExample();
        await customPoolConfigExample();
        // await poolManagementExample();
        // await disablePoolingExample();
    } catch (error) {
        console.error('Example error:', error.message);
    }
}

runExamples();