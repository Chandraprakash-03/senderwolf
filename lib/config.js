import { cosmiconfig } from "cosmiconfig";
import fs from "fs";
import path from "path";
import { registerProvider, registerDomain } from "./providers.js";

export async function loadConfig() {
    const explorer = cosmiconfig("senderwolf");

    let config = {};

    // Load from current directory
    const cwdConfig = path.join(process.cwd(), ".senderwolfrc.json");
    if (fs.existsSync(cwdConfig)) {
        config = JSON.parse(fs.readFileSync(cwdConfig, "utf-8"));
    } else {
        // Use cosmiconfig for other formats
        const result = await explorer.search(process.cwd());
        if (result && result.config) {
            config = result.config;
        } else {
            // Load from home directory
            const homeDir = process.env.HOME || process.env.USERPROFILE;
            if (homeDir) {
                const homeConfig = path.join(homeDir, ".senderwolfrc.json");
                if (fs.existsSync(homeConfig)) {
                    config = JSON.parse(fs.readFileSync(homeConfig, "utf-8"));
                }
            }
        }
    }

    // Register custom providers from config
    if (config.customProviders) {
        for (const [name, providerConfig] of Object.entries(config.customProviders)) {
            try {
                registerProvider(name, providerConfig);
            } catch (error) {
                console.warn(`Failed to register custom provider '${name}':`, error.message);
            }
        }
    }

    // Register custom domain mappings from config
    if (config.customDomains) {
        for (const [domain, provider] of Object.entries(config.customDomains)) {
            registerDomain(domain, provider);
        }
    }

    return config;
}
