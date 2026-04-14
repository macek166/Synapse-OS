import { App, TFile, WorkspaceLeaf } from "obsidian";
import { Storage } from "../Storage";
import { ActivityLog } from "../data/types";

export class Telemetry {
    private app: App;
    private storage: Storage;
    private idleTimeoutMs: number;
    private flushIntervalMs: number;

    private activeFile: TFile | null = null;
    private lastActivityTime: number = Date.now();
    private lastTick: number = Date.now();
    
    private logData: ActivityLog = {};
    
    private isWriting = false;
    private writeTimer: NodeJS.Timeout | null = null;
    private flushTimer: NodeJS.Timeout | null = null;
    private tickTimer: NodeJS.Timeout | null = null;
    private boundResetActivity: () => void;

    constructor(app: App, storage: Storage, idleTimeoutMs: number, flushIntervalMs: number) {
        this.app = app;
        this.storage = storage;
        this.idleTimeoutMs = idleTimeoutMs;
        this.flushIntervalMs = flushIntervalMs;
        this.boundResetActivity = this.resetActivity.bind(this);
    }

    async init() {
        this.logData = await this.storage.readActivityLog();

        this.app.workspace.on('file-open', (file) => this.handleFileOpen(file));
        this.app.workspace.on('editor-change', () => this.handleEditorChange());
        
        this.registerDomEvents();

        this.lastTick = Date.now();
        this.tickTimer = setInterval(() => this.tick(), 1000);

        this.flushTimer = setInterval(() => this.flush(), this.flushIntervalMs);
    }

    private resetActivity() {
        this.lastActivityTime = Date.now();
    }

    private registerDomEvents() {
        window.addEventListener('mousemove', this.boundResetActivity);
        window.addEventListener('keydown', this.boundResetActivity);
        window.addEventListener('click', this.boundResetActivity);
        window.addEventListener('scroll', this.boundResetActivity, true);
    }

    private removeDomEvents() {
        window.removeEventListener('mousemove', this.boundResetActivity);
        window.removeEventListener('keydown', this.boundResetActivity);
        window.removeEventListener('click', this.boundResetActivity);
        window.removeEventListener('scroll', this.boundResetActivity, true);
    }

    private handleFileOpen(file: TFile | null) {
        this.activeFile = file;
        this.isWriting = false;
        this.resetActivity();
        this.lastTick = Date.now();
    }

    private handleEditorChange() {
        this.resetActivity();
        this.isWriting = true;
        
        if (this.writeTimer) clearTimeout(this.writeTimer);
        this.writeTimer = setTimeout(() => {
            this.isWriting = false;
        }, 2000);
    }

    private tick() {
        const now = Date.now();
        const delta = now - this.lastTick;
        this.lastTick = now;

        if (!this.activeFile) return;

        if (now - this.lastActivityTime > this.idleTimeoutMs) {
            return;
        }

        const path = this.activeFile.path;
        
        if (!this.logData[path]) {
            this.logData[path] = {
                read_time_ms: 0,
                write_time_ms: 0,
                last_accessed: new Date().toISOString()
            };
        }

        const entry = this.logData[path];
        entry.last_accessed = new Date().toISOString();

        if (this.isWriting) {
            entry.write_time_ms += delta;
        } else {
            entry.read_time_ms += delta;
        }
    }

    async flush() {
        await this.storage.saveActivityLog(this.logData);
    }

    async unload() {
        this.removeDomEvents();
        if (this.tickTimer) clearInterval(this.tickTimer);
        if (this.flushTimer) clearInterval(this.flushTimer);
        if (this.writeTimer) clearTimeout(this.writeTimer);
        await this.flush();
    }
}
