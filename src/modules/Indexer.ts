import { App, TFile, getAllTags } from "obsidian";
import { Storage } from "../Storage";
import { SemanticIndexItem } from "../data/types";

export class Indexer {
    private app: App;
    private storage: Storage;

    constructor(app: App, storage: Storage) {
        this.app = app;
        this.storage = storage;
    }

    async runInventory() {
        console.log("Synapse OS: Running Semantic Inventory...");
        const files = this.app.vault.getMarkdownFiles();
        const index: SemanticIndexItem[] = [];

        for (const file of files) {
            if (file.path.startsWith(this.storage.synapseDir)) {
                continue;
            }

            const metadata = this.app.metadataCache.getFileCache(file);
            const tags = metadata ? getAllTags(metadata) || [] : [];
            
            let keyClaims = "";
            try {
                const content = await this.app.vault.read(file);
                keyClaims = this.extractKeyClaims(content, metadata);
            } catch (e) {
                console.error(`Failed to read file for indexing: ${file.path}`, e);
            }

            index.push({
                filename: file.basename,
                folder: file.parent?.path || "/",
                tags,
                key_claims: keyClaims
            });
        }

        await this.storage.saveSemanticIndex(index);
        console.log("Synapse OS: Semantic Inventory completed.");
    }

    private extractKeyClaims(content: string, metadata: any): string {
        let body = content;
        if (metadata?.frontmatter) {
            const endOffset = metadata.frontmatterPosition?.end?.offset;
            if (endOffset) {
                body = content.substring(endOffset).trim();
            } else {
                body = content.replace(/^---[\s\S]*?---\n/, '').trim();
            }
        }
        
        const lines = body.split('\n');
        const paragraphLines: string[] = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length === 0) {
                if (paragraphLines.length > 0) {
                    break;
                }
                continue;
            }
            if (trimmed.startsWith('#')) {
                continue;
            }
            paragraphLines.push(trimmed);
            
            if (paragraphLines.length >= 3) break;
        }

        return paragraphLines.join(" ").substring(0, 500);
    }
}
