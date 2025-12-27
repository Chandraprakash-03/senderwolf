/**
 * Email Templates System Demo for Senderwolf
 * Demonstrates template creation, management, and usage
 */

import {
    createMailer,
    registerTemplate,
    getTemplate,
    listTemplates,
    previewTemplate,
    loadTemplateFromFile,
    saveTemplateToFile,
    TemplateManager,
    BUILTIN_TEMPLATES
} from '../index.js';

// Demo configuration (replace with your actual SMTP settings)
const mailerConfig = {
    smtp: {
        provider: 'gmail',
        auth: {
            user: 'your@gmail.com',
            pass: 'your-app-password'
        }
    },
    defaults: {
        fromName: 'Demo App',
        fromEmail: 'your@gmail.com'
    }
};

async function demonstrateTemplateSystem() {
    console.log('🐺 Senderwolf Email Templates Demo\n');

    // 1. List built-in templates
    console.log('📋 Built-in Templates:');
    const builtinTemplates = listTemplates();
    builtinTemplates.forEach(template => {
        console.log(`  - ${template.name} (${template.category}): ${template.description}`);
    });
    console.log();

    // 2. Create a custom template
    console.log('🎨 Creating Custom Template...');
    const customTemplate = registerTemplate('orderConfirmation', {
        subject: 'Order Confirmation #{{orderNumber}}',
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
                    <li>{{this.name}} - Qty: {{this.quantity}} - {{ this.price }}</li>
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
            Total: {{ totalAmount }}
            
            Items:
            {{#each items}}
            - {{this.name}} - Qty: {{this.quantity}} - {{ this.price }}
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

    console.log(`✅ Created template: ${customTemplate.name}`);
    console.log(`   Variables: ${customTemplate.variables.join(', ')}`);
    console.log();

    // 3. Preview template with sample data
    console.log('👀 Template Preview:');
    const sampleData = {
        customerName: 'John Doe',
        orderNumber: 'ORD-12345',
        orderDate: '2025-01-15',
        totalAmount: '149.99',
        companyName: 'Demo Store',
        shippingAddress: '123 Main St, Anytown, ST 12345',
        items: [
            { name: 'Wireless Headphones', quantity: 1, price: '99.99' },
            { name: 'Phone Case', quantity: 2, price: '25.00' }
        ]
    };

    const preview = previewTemplate('orderConfirmation', sampleData);
    console.log('Subject:', preview.subject);
    console.log('HTML Preview (first 200 chars):', preview.html.substring(0, 200) + '...');
    console.log();

    // 4. Demonstrate conditional rendering
    console.log('🔀 Conditional Rendering Demo:');

    // Register a template with conditions
    registerTemplate('conditionalDemo', {
        subject: 'Welcome{{#if isPremium}} Premium{{/if}} User!',
        html: `
            <h1>Welcome {{userName}}!</h1>
            {{#if isPremium}}
            <div style="background: gold; padding: 10px;">
                <p>🌟 Thank you for being a Premium member!</p>
                <p>You have access to exclusive features.</p>
            </div>
            {{/if}}
            
            {{#unless hasCompletedProfile}}
            <div style="background: #fff3cd; padding: 10px;">
                <p>⚠️ Please complete your profile to get started.</p>
            </div>
            {{/unless}}
            
            <h3>Your Benefits:</h3>
            <ul>
                {{#each benefits}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        `,
        description: 'Demo template with conditions',
        category: 'demo'
    });

    // Test with premium user
    const premiumPreview = previewTemplate('conditionalDemo', {
        userName: 'Alice Premium',
        isPremium: true,
        hasCompletedProfile: true,
        benefits: ['Priority Support', 'Advanced Features', 'Monthly Reports']
    });
    console.log('Premium User Subject:', premiumPreview.subject);

    // Test with regular user
    const regularPreview = previewTemplate('conditionalDemo', {
        userName: 'Bob Regular',
        isPremium: false,
        hasCompletedProfile: false,
        benefits: ['Basic Support', 'Standard Features']
    });
    console.log('Regular User Subject:', regularPreview.subject);
    console.log();

    // 5. Save and load templates
    console.log('💾 Template File Operations:');

    try {
        // Save template to file
        const filePath = './custom-template.json';
        await saveTemplateToFile('orderConfirmation', filePath);
        console.log(`✅ Saved template to ${filePath}`);

        // Remove from memory and reload
        TemplateManager.removeTemplate('orderConfirmation');
        console.log('🗑️ Removed template from memory');

        // Load back from file
        const loadedTemplate = await loadTemplateFromFile(filePath);
        console.log(`✅ Loaded template: ${loadedTemplate.name}`);

        // Clean up
        const { unlink } = await import('fs/promises');
        await unlink(filePath);
        console.log('🧹 Cleaned up demo file');
    } catch (error) {
        console.log('⚠️ File operations demo skipped:', error.message);
    }
    console.log();

    // 6. Demonstrate mailer integration
    console.log('📧 Mailer Integration Demo:');

    // Create mailer instance
    const mailer = createMailer(mailerConfig);

    // Preview built-in welcome template
    const welcomePreview = mailer.previewTemplate('welcome', {
        appName: 'Demo App',
        userName: 'Test User',
        verificationRequired: true,
        verificationUrl: 'https://example.com/verify?token=abc123'
    });

    console.log('Welcome Template Preview:');
    console.log('Subject:', welcomePreview.subject);
    console.log('HTML (first 150 chars):', welcomePreview.html.substring(0, 150) + '...');
    console.log();

    // 7. Bulk template sending demo (preview only)
    console.log('📬 Bulk Template Sending Demo:');

    const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

    console.log('Would send notification template to:');
    recipients.forEach((recipient, index) => {
        const variables = {
            userName: `User ${index + 1}`,
            title: 'System Maintenance Notice',
            message: 'We will be performing scheduled maintenance tonight from 2-4 AM EST.',
            actionRequired: true,
            actionUrl: 'https://example.com/maintenance',
            actionText: 'View Details',
            senderName: 'System Admin'
        };

        const preview = mailer.previewTemplate('notification', variables);
        console.log(`  - ${recipient}: "${preview.subject}"`);
    });
    console.log();

    // 8. Template validation
    console.log('✅ Template Validation:');

    // Create a template with syntax error
    try {
        registerTemplate('invalidTemplate', {
            subject: 'Test {{unclosed',
            html: '<h1>{{#if condition}}</h1>', // Missing closing tag
            description: 'Template with errors'
        });
    } catch (error) {
        console.log('❌ Validation caught error:', error.message);
    }

    // Validate existing template
    const template = getTemplate('welcome');
    if (template) {
        const validation = template.validate();
        console.log(`✅ Welcome template validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);
        if (!validation.valid) {
            validation.errors.forEach(error => console.log(`   - ${error}`));
        }
    }
    console.log();

    // 9. List templates by category
    console.log('📂 Templates by Category:');
    const categories = TemplateManager.getCategories();
    categories.forEach(category => {
        const categoryTemplates = listTemplates(category);
        console.log(`  ${category} (${categoryTemplates.length}):`);
        categoryTemplates.forEach(template => {
            console.log(`    - ${template.name}: ${template.description}`);
        });
    });
    console.log();

    console.log('🎉 Template system demo completed!');
    console.log('\n📚 Key Features Demonstrated:');
    console.log('  ✅ Built-in templates (welcome, passwordReset, notification, invoice)');
    console.log('  ✅ Custom template creation and registration');
    console.log('  ✅ Variable substitution with {{variable}} syntax');
    console.log('  ✅ Conditional rendering with {{#if}} and {{#unless}}');
    console.log('  ✅ Loop rendering with {{#each}}');
    console.log('  ✅ Template preview without sending');
    console.log('  ✅ File-based template storage and loading');
    console.log('  ✅ Mailer integration for template-based sending');
    console.log('  ✅ Bulk template sending with per-recipient variables');
    console.log('  ✅ Template validation and error handling');
    console.log('  ✅ Category-based template organization');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateTemplateSystem().catch(console.error);
}

export { demonstrateTemplateSystem };