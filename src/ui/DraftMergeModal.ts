import { App, Modal, TFile, Notice } from "obsidian";
import * as Diff from "diff";
import SynapseOSPlugin from "../main";

export class DraftMergeModal extends Modal {
    plugin: SynapseOSPlugin;

    constructor(app: App, plugin: SynapseOSPlugin) {
        super(app);
        this.plugin = plugin;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: "Synapse OS: Review Draft" });

        const draftFile = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.synapseDir}/Draft_Buffer.md`);
        if (!(draftFile instanceof TFile)) {
            contentEl.createEl("p", { text: "No pending drafts." });
            return;
        }

        const draftContent = await this.app.vault.read(draftFile);
        
        const targetMatch = draftContent.match(/# Target Note\n\[\[(.*?)\]\]/);
        const proposedMatch = draftContent.match(/# Proposed Content\n([\s\S]*)/);

        if (!targetMatch || !proposedMatch) {
            contentEl.createEl("p", { text: "Draft format invalid. Waiting for agent to write exact format." });
            return;
        }

        const targetFileName = targetMatch[1] + (targetMatch[1].endsWith('.md') ? '' : '.md');
        const proposedText = proposedMatch[1].trim();

        const targetFile = this.app.metadataCache.getFirstLinkpathDest(targetMatch[1], "");
        
        if (!targetFile) {
            contentEl.createEl("p", { text: `Target note ${targetFileName} not found in vault.` });
            return;
        }

        const originalText = await this.app.vault.read(targetFile);

        const diffs = Diff.diffWordsWithSpace(originalText, proposedText);

        const diffContainer = contentEl.createDiv({ cls: "synapse-diff-container" });
        
        diffs.forEach(part => {
            const span = diffContainer.createSpan();
            span.setText(part.value);
            if (part.added) {
                span.addClass("synapse-diff-added");
            } else if (part.removed) {
                span.addClass("synapse-diff-removed");
            } else {
                span.addClass("synapse-diff-unchanged");
            }
        });

        const btnContainer = contentEl.createDiv({ cls: "modal-button-container" });
        const mergeBtn = btnContainer.createEl("button", { text: "Accept & Merge", cls: "mod-cta" });
        mergeBtn.addEventListener("click", async () => {
            await this.app.vault.modify(targetFile, proposedText);
            await this.app.vault.modify(draftFile, "");
            new Notice("Draft merged successfully.");
            this.close();
            
            const leaves = this.app.workspace.getLeavesOfType("synapse-dashboard-view");
            for (const leaf of leaves) {
                if (leaf.view.getViewType() === "synapse-dashboard-view") {
                    // @ts-ignore
                    leaf.view.renderDashboard();
                }
            }
        });
        
        const cancelBtn = btnContainer.createEl("button", { text: "Discard Draft" });
        cancelBtn.addEventListener("click", async () => {
            await this.app.vault.modify(draftFile, "");
            new Notice("Draft discarded.");
            this.close();
            
            const leaves = this.app.workspace.getLeavesOfType("synapse-dashboard-view");
            for (const leaf of leaves) {
                if (leaf.view.getViewType() === "synapse-dashboard-view") {
                    // @ts-ignore
                    leaf.view.renderDashboard();
                }
            }
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
