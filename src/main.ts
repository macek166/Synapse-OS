import { Plugin, WorkspaceLeaf } from "obsidian";
import { Storage } from "./Storage";
import { DEFAULT_SETTINGS, SynapseSettings } from "./data/types";
import { Telemetry } from "./modules/Telemetry";
import { Indexer } from "./modules/Indexer";
import { DashboardView, VIEW_TYPE_SYNAPSE_DASHBOARD } from "./ui/DashboardView";
import { DraftMergeModal } from "./ui/DraftMergeModal";

export default class SynapseOSPlugin extends Plugin {
    settings: SynapseSettings;
    storage: Storage;
    telemetry: Telemetry;
    indexer: Indexer;

    async onload() {
        await this.loadSettings();
        
        this.storage = new Storage(this.app, this.settings.synapseDir);
        await this.storage.ensureSynapseDirExists();

        this.telemetry = new Telemetry(
            this.app, 
            this.storage, 
            this.settings.idleTimeoutMs, 
            this.settings.flushIntervalMs
        );
        
        this.indexer = new Indexer(this.app, this.storage);

        this.registerView(
            VIEW_TYPE_SYNAPSE_DASHBOARD,
            (leaf) => new DashboardView(leaf, this)
        );

        this.app.workspace.onLayoutReady(async () => {
            await this.telemetry.init();
        });

        this.addRibbonIcon('brain-circuit', 'Synapse Dashboard', () => {
            this.activateDashboardView();
        });

        this.addCommand({
            id: 'run-inventory',
            name: 'Run Semantic Inventory',
            callback: () => {
                this.indexer.runInventory();
            }
        });

        this.addCommand({
            id: 'open-dashboard',
            name: 'Open Dashboard',
            callback: () => {
                this.activateDashboardView();
            }
        });

        this.addCommand({
            id: 'open-draft-merge',
            name: 'Review Pending Draft',
            callback: () => {
                new DraftMergeModal(this.app, this).open();
            }
        });
        
        console.log("Synapse OS loaded");
    }

    async activateDashboardView() {
        const { workspace } = this.app;
        
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_SYNAPSE_DASHBOARD);

        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            // @ts-ignore
            leaf = workspace.getRightLeaf(false);
            if(leaf) await leaf.setViewState({ type: VIEW_TYPE_SYNAPSE_DASHBOARD, active: true });
        }

        if(leaf) workspace.revealLeaf(leaf);
    }

    async onunload() {
        console.log("Unloading Synapse OS");
        if (this.telemetry) {
            await this.telemetry.unload();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
