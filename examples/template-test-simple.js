/**
 * Simple Template System Test
 * Basic tests for the email templates system
 */

import {
    registerTemplate,
    getTemplate,
    listTemplates,
    removeTemplate,
    previewTemplate,
    TemplateEngine,
    BUILTIN_TEMPLATES
} from '../index.js';

function runSimpleTests() {
    console.log('🧪 Running Simple Template Tests\n');

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

    // Test 1: Basic variable substitution
    test('Basic Variable Substitution', () => {
        const result = TemplateEngine.compile('Hello {{name}}!', { name: 'World' });
        assert(result === 'Hello World!', `Expected 'Hello World!', got '${result}'`);
    });

    // Test 2: Built-in templates exist
    test('Built-in Templates Exist', () => {
        const welcome = getTemplate('welcome');
        assert(welcome !== null, 'Welcome template should exist');

        const passwordReset = getTemplate('passwordReset');
        assert(passwordReset !== null, 'Password reset template should exist');

        const notification = getTemplate('notification');
        assert(notification !== null, 'Notification template should exist');

        const invoice = getTemplate('invoice');
        assert(invoice !== null, 'Invoice template should exist');
    });

    // Test 3: Template registration
    test('Template Registration', () => {
        const template = registerTemplate('testTemplate', {
            subject: 'Test {{name}}',
            html: '<h1>Hello {{name}}!</h1>',
            description: 'Test template'
        });

        assert(template.name === 'testTemplate', 'Template name should match');
        assert(template.variables.includes('name'), 'Should detect name variable');
    });

    // Test 4: Template rendering
    test('Template Rendering', () => {
        const template = getTemplate('testTemplate');
        const rendered = template.render({ name: 'John' });

        assert(rendered.subject === 'Test John', `Expected 'Test John', got '${rendered.subject}'`);
        assert(rendered.html === '<h1>Hello John!</h1>', `Expected '<h1>Hello John!</h1>', got '${rendered.html}'`);
    });

    // Test 5: Conditional rendering
    test('Conditional Rendering', () => {
        const template = '{{#if premium}}Premium{{/if}} User';
        const premium = TemplateEngine.compile(template, { premium: true });
        const regular = TemplateEngine.compile(template, { premium: false });

        assert(premium === 'Premium User', `Expected 'Premium User', got '${premium}'`);
        assert(regular === ' User', `Expected ' User', got '${regular}'`);
    });

    // Test 6: Loop rendering
    test('Loop Rendering', () => {
        const template = '{{#each items}}{{this.name}},{{/each}}';
        const result = TemplateEngine.compile(template, {
            items: [{ name: 'A' }, { name: 'B' }]
        });
        assert(result === 'A,B,', `Expected 'A,B,', got '${result}'`);
    });

    // Test 7: Built-in template rendering
    test('Built-in Template Rendering', () => {
        const rendered = previewTemplate('welcome', {
            appName: 'Test App',
            userName: 'John Doe',
            verificationRequired: true,
            verificationUrl: 'https://example.com/verify'
        });

        assert(rendered.subject.includes('Test App'), 'Subject should include app name');
        assert(rendered.html.includes('John Doe'), 'HTML should include user name');
        assert(rendered.html.includes('https://example.com/verify'), 'HTML should include verification URL');
    });

    // Test 8: Template listing
    test('Template Listing', () => {
        const templates = listTemplates();
        assert(templates.length > 0, 'Should have templates');
        assert(templates.some(t => t.name === 'testTemplate'), 'Should include test template');
        assert(templates.some(t => t.name === 'welcome'), 'Should include welcome template');
    });

    // Clean up
    removeTemplate('testTemplate');

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
    runSimpleTests();
}

export { runSimpleTests };