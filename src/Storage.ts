import { App, TFolder, normalizePath, TFile } from "obsidian";
import { ActivityLog, SemanticIndex } from "./data/types";

export class Storage {
    app: App;
    synapseDir: string;

    constructor(app: App, synapseDir: string) {
        this.app = app;
        this.synapseDir = synapseDir;
    }

    async ensureSynapseDirExists() {
        const folder = this.app.vault.getAbstractFileByPath(normalizePath(this.synapseDir));
        if (!folder) {
            await this.app.vault.createFolder(normalizePath(this.synapseDir));
        }
    }

    private async readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
        const path = normalizePath(`${this.synapseDir}/${filename}`);
        const file = this.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) {
            return defaultValue;
        }
        try {
            const content = await this.app.vault.read(file);
            return JSON.parse(content) as T;
        } catch (e) {
            console.error(`Error reading ${path}`, e);
            return defaultValue;
        }
    }

    private async writeJsonFile<T>(filename: string, data: T) {
        await this.ensureSynapseDirExists();
        const path = normalizePath(`${this.synapseDir}/${filename}`);
        const file = this.app.vault.getAbstractFileByPath(path);
        const content = JSON.stringify(data, null, 2);
        
        if (file instanceof TFile) {
            await this.app.vault.modify(file, content);
        } else {
            await this.app.vault.create(path, content);
        }
    }

    async readActivityLog(): Promise<ActivityLog> {
        return this.readJsonFile<ActivityLog>("activity_log.json", {});
    }

    async saveActivityLog(log: ActivityLog) {
        await this.writeJsonFile("activity_log.json", log);
    }

    async saveSemanticIndex(index: SemanticIndex) {
        await this.writeJsonFile("synapse-index.json", index);
    }
}
