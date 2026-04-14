import { ItemView, WorkspaceLeaf, TFile, MarkdownRenderer } from "obsidian";
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, RadarController } from "chart.js";
import SynapseOSPlugin from "../main";

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, RadarController);

export const VIEW_TYPE_SYNAPSE_DASHBOARD = "synapse-dashboard-view";

export class DashboardView extends ItemView {
    plugin: SynapseOSPlugin;
    chartInstance: Chart | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: SynapseOSPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return VIEW_TYPE_SYNAPSE_DASHBOARD;
    }

    getDisplayText() {
        return "Synapse OS Dashboard";
    }

    getIcon() {
        return "brain-circuit";
    }

    async onOpen() {
        this.renderDashboard();
    }

    async renderDashboard() {
        const container = this.containerEl.children[1];
        container.empty();

        const dashContainer = container.createDiv({ cls: "synapse-dashboard-container" });

        const dashboardFile = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.synapseDir}/Dashboard_Data.md`);
        let content = "";
        let radarScores = { health: 0, career: 0, intellect: 0, hobbies: 0, creativity: 0, purpose: 0 };
        
        if (dashboardFile instanceof TFile) {
            content = await this.app.vault.read(dashboardFile);
            const metadata = this.app.metadataCache.getFileCache(dashboardFile);
            if (metadata?.frontmatter?.radar_scores) {
                radarScores = { ...radarScores, ...metadata.frontmatter.radar_scores };
            }
        }

        const draftFile = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.synapseDir}/Draft_Buffer.md`);
        if (draftFile instanceof TFile) {
            const draftContent = await this.app.vault.read(draftFile);
            if (draftContent.trim().length > 0) {
                const diffBanner = dashContainer.createDiv({ cls: "synapse-draft-alert" });
                diffBanner.createSpan({ text: "⚠️ You have pending Drafts from Synapse. Click to review." });
                diffBanner.addEventListener("click", () => {
                    // @ts-ignore
                    this.app.commands.executeCommandById("synapse-os:open-draft-merge");
                });
            }
        }

        const chartWrapper = dashContainer.createDiv({ cls: "synapse-chart-container" });
        const canvas = chartWrapper.createEl("canvas");
        this.renderChart(canvas, radarScores);

        if (content) {
            const sections = content.split(/^#\s+/m).filter(s => s.trim().length > 0 && !s.startsWith('---'));
            
            for (const section of sections) {
                const lines = section.split('\n');
                const title = lines[0].trim();
                const body = lines.slice(1).join('\n').trim();
                
                const sectionEl = dashContainer.createDiv({ cls: "synapse-section" });
                if (title.toLowerCase().includes("shadow") || title.toLowerCase().includes("challenge")) {
                    sectionEl.addClass("synapse-shadow-box");
                }
                
                sectionEl.createEl("h3", { text: title });
                const contentEl = sectionEl.createDiv({ cls: "synapse-section-content" });
                
                MarkdownRenderer.renderMarkdown(body, contentEl, "", this);
            }
        } else {
            const emptyState = dashContainer.createDiv({ cls: "synapse-section" });
            emptyState.createEl("h3", { text: "No Data" });
            emptyState.createEl("p", { text: "Generate the Dashboard data via the agent first." });
        }
    }

    renderChart(canvas: HTMLCanvasElement, scores: Record<string, number>) {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(canvas, {
            type: 'radar',
            data: {
                labels: ['Health', 'Career', 'Intellect', 'Hobbies', 'Creativity', 'Purpose'],
                datasets: [{
                    label: 'Brain Activity',
                    data: [
                        scores.health || 0,
                        scores.career || 0,
                        scores.intellect || 0,
                        scores.hobbies || 0,
                        scores.creativity || 0,
                        scores.purpose || 0
                    ],
                    backgroundColor: 'rgba(116, 123, 255, 0.4)',
                    borderColor: 'rgba(116, 123, 255, 1)',
                    pointBackgroundColor: 'rgba(116, 123, 255, 1)',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(150, 150, 150, 0.2)' },
                        grid: { color: 'rgba(150, 150, 150, 0.2)' },
                        pointLabels: {
                            color: '#adadad',
                            font: { size: 14 }
                        },
                        ticks: {
                            display: false,
                            min: 0,
                            max: 10
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    async onClose() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }
}
