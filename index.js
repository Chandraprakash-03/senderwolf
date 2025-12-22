// Main email sending function
export { sendEmail, closeAllPools, getPoolStats } from './lib/sendEmail.js';

// Simple API for easier usage
export {
    createMailer,
    quickSend,
    sendGmail,
    sendOutlook,
    testConnection,
    listProviders
} from './lib/simple.js';

// Provider utilities
export {
    getProviderConfig,
    detectProvider,
    registerProvider,
    unregisterProvider,
    registerDomain,
    hasProvider,
    suggestSMTPSettings,
    getAllProviders,
    SMTP_PROVIDERS
} from './lib/providers.js';

// Configuration utilities
export { loadConfig } from './lib/config.js';
