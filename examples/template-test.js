/**
 * Template System Test Suite
 * Comprehensive tests for the email templates system
 */

import {
    registerTemplate,
    getTemplate,
    listTemplates,
    removeTemplate,
    previewTemplate,
    createMailer,
    TemplateEngine,
    EmailTemplate,
    TemplateManager,
    BUILTIN_TEMPLATES
} from '../index.js';

// Test configuration
const testConfig = {
    smtp: {
        provider: 'gmail',
        auth: {
            user: 'test@gmail.com',
            pass: 'test-password'
        }
    }
};

function runTests() {
    console.log('🧪 Running Template System Tests\n');

    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        try {
            fn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.log(`❌ ${name}: ${error.message}`);
            failed++;
        }
    }

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    // Test 1: Template Engine - Basic Variable Substitution
    test('Template Engine - Basic Variables', () => {
        const result = TemplateEngine.compile('Hello {{name}}!', { name: 'World' });
        assertEquals(result, 'Hello World!');
    });

    // Test 2: Template Engine - Nested Properties
    test('Template Engine - Nested Properties', () => {
        const result = TemplateEngine.compile('{{user.name}} ({{user.email}})', {
            user: { name: 'John', email: 'john@example.com' }
        });
        assertEquals(result, 'John (john@example.com)');
    });

    // Test 3: Template Engine - Conditional Rendering
    test('Template Engine - If Conditions', () => {
        const template = '{{#if premium}}Premium{{/if}} User';
        const premium = TemplateEngine.compile(template, { premium: true });
        const regular = TemplateEngine.compile(template, { premium: false });

        assertEquals(premium, 'Premium User');
        assertEquals(regular, ' User');
    });

    // Test 4: Template Engine - Unless Conditions
    test('Template Engine - Unless Conditions', () => {
        const template = '{{#unless complete}}Incomplete{{/unless}}';
        const incomplete = TemplateEngine.compile(template, { complete: false });
        const complete = TemplateEngine.compile(template, { complete: true });

        assertEquals(incomplete, 'Incomplete');
        assertEquals(complete, '');
    });

    // Test 5: Template Engine - Each Loops
    test('Template Engine - Each Loops', () => {
        const template = '{{#each items}}{{this.name}},{{/each}}';
        const result = TemplateEngine.compile(template, {
            items: [{ name: 'A' }, { name: 'B' }]
        });
        assertEquals(result, 'A,B,');
    });

    // Test 6: Template Engine - Loop Variables
    test('Template Engine - Loop Variables', () => {
        const template = '{{#each items}}{{@index}}:{{this}}{{#unless @last}},{{/unless}}{{/each}}';
        const result = TemplateEngine.compile(template, {
            items: ['A', 'B', 'C']
        });
        assertEquals(result, '0:A,1:B,2:C');
    });

    // Test 7: Template Engine - Variable Extraction
    test('Template Engine - Variable Extraction', () => {
        const variables = TemplateEngine.extractVariables('{{name}} {{user.email}} {{#if premium}}{{/if}}');
        assert(variables.includes('name'));
        assert(variables.includes('user.email'));
        assert(variables.includes('premium'));
    });

    // Test 8: Template Registration
    test('Template Registration', () => {
        const template = registerTemplate('testTemplate', {
            subject: 'Test {{name}}',
            html: '<h1>Hello {{name}}!</h1>',
            description: 'Test template'
        });

        assert(template instanceof EmailTemplate);
        assertEquals(template.name, 'testTemplate');
        assert(template.variables.includes('name'));
    });

    // Test 9: Template Retrieval
    test('Template Retrieval', () => {
        const template = getTemplate('testTemplate');
        assert(template !== null);
        assertEquals(template.name, 'testTemplate');
    });

    // Test 10: Template Rendering
    test('Template Rendering', () => {
        const template = getTemplate('testTemplate');
        const rendered = template.render({ name: 'John' });

        assertEquals(rendered.subject, 'Test John');
        assertEquals(rendered.html, '<h1>Hello John!</h1>');
    });

    // Test 11: Template Validation
    test('Template Validation', () => {
        const template = getTemplate('testTemplate');
        const validation = template.validate();
        assert(validation.valid);
        assertEquals(validation.errors.length, 0);
    });

    // Test 12: Invalid Template Validation
    test('Invalid Template Validation', () => {
        try {
            registerTemplate('invalidTemplate', {
                subject: 'Test {{unclosed',
                html: '<h1>Invalid</h1>'
            });
            assert(false, 'Should have thrown validation error');
        } catch (error) {
            assert(error.message.includes('validation failed'));
        }
    });

    // Test 13: Template Listing
    test('Template Listing', () => {
        const templates = listTemplates();
        assert(templates.length > 0);
        assert(templates.some(t => t.name === 'testTemplate'));
    });

    // Test 14: Template Listing by Category
    test('Template Listing by Category', () => {
        registerTemplate('authTemplate', {
            subject: 'Auth',
            html: '<p>Auth</p>',
            category: 'authentication'
        });

        const authTemplates = listTemplates('authentication');
        assert(authTemplates.some(t => t.name === 'authTemplate'));
        assert(authTemplates.every(t => t.category === 'authentication'));
    });

    // Test 15: Built-in Templates
    test('Built-in Templates', () => {
        const welcome = getTemplate('welcome');
        assert(welcome !== null);
        assertEquals(welcome.category, 'authentication');

        const passwordReset = getTemplate('passwordReset');
        assert(passwordReset !== null);

        const notification = getTemplate('notification');
        assert(notification !== null);

        const invoice = getTemplate('invoice');
        assert(invoice !== null);
    });

    // Test 16: Built-in Template Rendering
    test('Built-in Template Rendering', () => {
        const rendered = previewTemplate('welcome', {
            appName: 'Test App',
            userName: 'John Doe',
            verificationRequired: true,
            verificationUrl: 'https://example.com/verify'
        });

        assert(rendered.subject.includes('Test App'));
        assert(rendered.html.includes('John Doe'));
        assert(rendered.html.includes('https://example.com/verify'));
    });

    // Test 17: Mailer Template Integration
    test('Mailer Template Integration', () => {
        const mailer = createMailer(testConfig);

        // Test preview method
        const preview = mailer.previewTemplate('welcome', {
            appName: 'Test App',
            userName: 'Test User'
        });

        assert(preview.subject.includes('Test App'));
        assert(preview.html.includes('Test User'));
    });

    // Test 18: Template Categories
    test('Template Categories', () => {
        const categories = TemplateManager.getCategories();
        assert(categories.includes('authentication'));
        assert(categories.includes('notification'));
        assert(categories.includes('business'));
    });

    // Test 19: Template Update
    test('Template Update', () => {
        const updated = TemplateManager.updateTemplate('testTemplate', {
            description: 'Updated test template'
        });

        assertEquals(updated.description, 'Updated test template');
        assertEquals(updated.name, 'testTemplate');
    });

    // Test 20: Template Removal
    test('Template Removal', () => {
        const removed = removeTemplate('testTemplate');
        assert(removed);

        const template = getTemplate('testTemplate');
        assert(template === null);
    });

    // Test 21: Complex Template with All Features
    test('Complex Template', () => {
        registerTemplate('complexTemplate', {
            subject: '{{#if urgent}}URGENT: {{/if}}{{title}}',
            html: `
                <h1>{{title}}</h1>
                <p>Dear {{user.name}},</p>
                
                {{#if urgent}}
                <div style="color: red;">
                    <strong>This is urgent!</strong>
                </div>
                {{/if}}
                
                {{#unless user.verified}}
                <p>Please verify your account.</p>
                {{/unless}}
                
                <h3>Items:</h3>
                <ul>
                    {{#each items}}
                    <li>{{@index}}: {{this.name}} - {{#if @last}} (Last item){{/if}}</li>
                    {{/each}}
                </ul>
                
                <p>Total: ${{ total }}</p>
            `,
            description: 'Complex template with all features'
        });

        const rendered = previewTemplate('complexTemplate', {
            urgent: true,
            title: 'Order Summary',
            user: { name: 'John Doe', verified: false },
            items: [
                { name: 'Item A', price: '10.00' },
                { name: 'Item B', price: '20.00' }
            ],
            total: '30.00'
        });

        assert(rendered.subject.includes('URGENT'));
        assert(rendered.html.includes('John Doe'));
        assert(rendered.html.includes('verify your account'));
        assert(rendered.html.includes('Item A'));
        assert(rendered.html.includes('Last item'));
        assert(rendered.html.includes('$30.00'));
    });

    // Test 22: Empty Variables Handling
    test('Empty Variables Handling', () => {
        const result = TemplateEngine.compile('Hello {{name}}!', {});
        assertEquals(result, 'Hello !');
    });

    // Test 23: Null/Undefined Variables
    test('Null/Undefined Variables', () => {
        const result = TemplateEngine.compile('{{name}} {{age}}', {
            name: null,
            age: undefined
        });
        assertEquals(result, ' ');
    });

    // Test 24: Boolean Variables in Conditions
    test('Boolean Variables in Conditions', () => {
        const template = '{{#if active}}Active{{/if}}{{#unless active}}Inactive{{/unless}}';

        const activeResult = TemplateEngine.compile(template, { active: true });
        assertEquals(activeResult, 'Active');

        const inactiveResult = TemplateEngine.compile(template, { active: false });
        assertEquals(inactiveResult, 'Inactive');
    });

    // Test 25: Array Length in Conditions
    test('Array Length in Conditions', () => {
        const template = '{{#if items}}Has items{{/if}}{{#unless items}}No items{{/unless}}';

        const withItems = TemplateEngine.compile(template, { items: ['a', 'b'] });
        assertEquals(withItems, 'Has items');

        const withoutItems = TemplateEngine.compile(template, { items: [] });
        assertEquals(withoutItems, 'No items');
    });

    // Clean up test templates
    removeTemplate('complexTemplate');
    removeTemplate('authTemplate');

    // Summary
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('❌ Some tests failed.');
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { runTests };