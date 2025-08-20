import { cosmiconfig } from "cosmiconfig";
import fs from "fs";
import path from "path";

export async function loadConfig() {
    const explorer = cosmiconfig("senderwolf");

    const cwdConfig = path.join(process.cwd(), ".senderwolfrc.json");
    if (fs.existsSync(cwdConfig)) {
        return JSON.parse(fs.readFileSync(cwdConfig, "utf-8"));
    }

    const result = await explorer.search(process.cwd());
    if (result && result.config) {
        return result.config;
    }

    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (homeDir) {
        const homeConfig = path.join(homeDir, ".senderwolfrc.json");
        if (fs.existsSync(homeConfig)) {
            return JSON.parse(fs.readFileSync(homeConfig, "utf-8"));
        }
    }

    return {};
}
