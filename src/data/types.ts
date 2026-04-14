export interface ActivityLogEntry {
    read_time_ms: number;
    write_time_ms: number;
    last_accessed: string;
}

export interface ActivityLog {
    [filepath: string]: ActivityLogEntry;
}

export interface SemanticIndexItem {
    filename: string;
    folder: string;
    tags: string[];
    key_claims: string;
}

export type SemanticIndex = SemanticIndexItem[];

export interface SynapseSettings {
    synapseDir: string;
    idleTimeoutMs: number;
    flushIntervalMs: number;
}

export const DEFAULT_SETTINGS: SynapseSettings = {
    synapseDir: "_Synapse",
    idleTimeoutMs: 120000,
    flushIntervalMs: 60000,
};
