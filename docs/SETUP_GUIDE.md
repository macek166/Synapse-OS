# 🛠️ Detailed Setup Guide

This guide walks you through the complete setup of Synapse OS — from zero to your first cognitive scan.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Install the Obsidian Plugin](#2-install-the-obsidian-plugin)
3. [Install the Agent Skills](#3-install-the-agent-skills)
4. [Connect Your IDE to Your Vault](#4-connect-your-ide-to-your-vault)
5. [First Run Walkthrough](#5-first-run-walkthrough)
6. [Understanding the Dashboard](#6-understanding-the-dashboard)
7. [Daily Workflow](#7-daily-workflow)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have:

| Requirement | Version | Purpose |
|:---|:---|:---|
| [Obsidian](https://obsidian.md) | v1.5.0+ | Your knowledge base |
| [Node.js](https://nodejs.org) | v18+ | Only needed if building from source |
| An AI-agent IDE | Any version | The brain that reads your vault |

### Supported AI IDEs

| IDE | Skill Support | How Skills Work |
|:---|:---|:---|
| **Google Antigravity** | ✅ Native | `.agent/skills/` folder, `@skill-name` invocation |
| **Claude Code** | ✅ Native | `.agent/skills/` folder, `@skill-name` invocation |
| **Cursor** | ✅ Native | Agent mode reads `.agent/skills/` |
| **OpenAI Codex** | ✅ Native | `.agent/skills/` convention |
| **Windsurf** | ✅ Native | `.agent/skills/` convention |
| **Any SKILL.md IDE** | ✅ Generic | Any IDE supporting the `.agent/skills/SKILL.md` pattern |

---

## 2. Install the Obsidian Plugin

### Option A: Download Release (Recommended)

1. Go to [Releases](https://github.com/macek166/Synapse-OS/releases)
2. Download these three files from the latest release:
   - `main.js`
   - `manifest.json`  
   - `styles.css`
3. In your Obsidian vault, navigate to the plugins directory:
   ```
   <your-vault>/.obsidian/plugins/
   ```
4. Create a new folder called `synapse-os`:
   ```
   <your-vault>/.obsidian/plugins/synapse-os/
   ```
5. Copy the three files into this folder
6. **Restart Obsidian** (close and reopen)
7. Go to **Settings → Community Plugins → Installed plugins**
8. Find **Synapse OS** and toggle it **ON**

> **Note:** If you don't see the `.obsidian` folder, enable "Show hidden files" in your file explorer.

### Option B: Build from Source

```bash
# Clone the repository
git clone https://github.com/macek166/Synapse-OS.git
cd Synapse-OS

# Install dependencies
npm install

# Build the plugin
npm run build

# Copy to your vault
cp main.js manifest.json styles.css <your-vault>/.obsidian/plugins/synapse-os/
```

### Verify Installation

After enabling the plugin:
1. You should see a **🧠 brain icon** in the left sidebar ribbon
2. A new `_Synapse/` folder should appear in your vault root
3. Open the command palette (`Ctrl+P` / `Cmd+P`) and search for "Synapse" — you should see 3 commands

---

## 3. Install the Agent Skills

Agent Skills are instruction files (`.md`) that tell your AI IDE how to analyze your vault. They are **not** Obsidian plugins — they are the AI's "personality" and protocol.

### Where to Place Skills

Skills must be placed in the `.agent/skills/` directory **within the workspace/project that your IDE has open.**

**Critical:** Your IDE workspace must include (or have access to) your Obsidian vault directory. The agent needs to read files from your vault.

### Step-by-Step

1. From the cloned repo, copy the three skill folders:

   **Linux / macOS:**
   ```bash
   cp -r agent-skills/synapse-os    <your-workspace>/.agent/skills/
   cp -r agent-skills/synapse-brain  <your-workspace>/.agent/skills/
   cp -r agent-skills/synapse-life   <your-workspace>/.agent/skills/
   ```

   **Windows (PowerShell):**
   ```powershell
   Copy-Item -Recurse agent-skills\synapse-os    <your-workspace>\.agent\skills\
   Copy-Item -Recurse agent-skills\synapse-brain  <your-workspace>\.agent\skills\
   Copy-Item -Recurse agent-skills\synapse-life   <your-workspace>\.agent\skills\
   ```

2. Your final structure should look like:
   ```
   <your-workspace>/
   ├── .agent/
   │   └── skills/
   │       ├── synapse-os/
   │       │   └── SKILL.md        ← Core brain (all protocols)
   │       ├── synapse-brain/
   │       │   └── SKILL.md        ← Shortcut: The Mirror
   │       └── synapse-life/
   │           └── SKILL.md        ← Shortcut: The Strategist
   ├── my-vault/                   ← Your Obsidian vault (or its parent)
   │   ├── _Synapse/
   │   │   ├── activity_log.json
   │   │   ├── synapse-index.json
   │   │   ├── Dashboard_Data.md
   │   │   ├── User_Profile.md
   │   │   └── Draft_Buffer.md
   │   └── ... (your notes)
   ```

### Optional: Initialize Starter Templates

If the plugin didn't auto-create the Synapse files, you can copy the starter templates:

```bash
cp templates/Dashboard_Data.md  <your-vault>/_Synapse/
cp templates/User_Profile.md    <your-vault>/_Synapse/
cp templates/Draft_Buffer.md    <your-vault>/_Synapse/
```

---

## 4. Connect Your IDE to Your Vault

The AI agent needs to **read and write files** in your Obsidian vault. Here's how to set this up for each IDE:

### Google Antigravity

1. Open Antigravity and **add your Obsidian vault as a workspace** (File → Add Workspace Folder)
2. Place skills in `<workspace>/.agent/skills/` (the workspace root that contains your vault)
3. Skills appear automatically in the `@` dropdown
4. The agent uses the **Obsidian MCP tools** to read/write vault files — make sure `obsidian-mcp-tools` is configured
5. Type `@synapse-brain` to run

### Claude Code

1. Navigate to your vault directory in the terminal
2. Place `.agent/skills/` in the project root
3. Start Claude Code: `claude`
4. Reference skills: `@synapse-brain`
5. Claude reads the SKILL.md and follows the protocol

### Cursor

1. Open your vault directory as a project in Cursor
2. Place `.agent/skills/` in the project root
3. Open the AI agent panel
4. Enable Agent mode (not just Chat)
5. Type `@synapse-brain` — Cursor reads the skill and executes

### OpenAI Codex

1. Place `.agent/skills/` in your project directory
2. Codex CLI reads them when referenced
3. Run: `@synapse-brain`

### Windsurf

1. Open vault as workspace
2. Place `.agent/skills/` in workspace root
3. Use the AI assistant panel with `@synapse-brain`

### 💡 Pro Tip: Symlink Strategy

If your IDE workspace is separate from your vault, create a symbolic link:

**Linux / macOS:**
```bash
ln -s /path/to/your/vault /path/to/workspace/my-vault
```

**Windows (PowerShell as Admin):**
```powershell
New-Item -ItemType SymbolicLink -Path "C:\workspace\my-vault" -Target "C:\Users\you\Documents\ObsidianVault"
```

---

## 5. First Run Walkthrough

### Phase 1: Let the Plugin Collect Data (1-3 hours)

1. Open your Obsidian vault with the plugin enabled
2. **Use Obsidian normally** — browse notes, edit, read
3. The plugin silently tracks:
   - How long you **read** each note (focus time)
   - How long you **write/edit** each note
   - Last access timestamps

> The plugin auto-saves telemetry every 60 seconds. Idle time (2+ min of no activity) is not counted.

### Phase 2: Run the Semantic Inventory

1. Open command palette (`Ctrl+P`)
2. Run: **Synapse OS: Run Semantic Inventory**
3. This creates `_Synapse/synapse-index.json` — a map of every note in your vault with tags and key claims

### Phase 3: Your First Brain Scan

1. Open your AI IDE
2. Type: `@synapse-brain`
3. The agent will:
   - Read `synapse-index.json` and `activity_log.json`
   - Analyze your notes for contradictions
   - Generate friction points and write them to `Draft_Buffer.md`
   - Calculate Radar scores and update `Dashboard_Data.md`
   - Present results in your chat

### Phase 4: Review the Dashboard

1. In Obsidian, click the **🧠 brain icon** in the ribbon (or run `Synapse OS: Open Dashboard`)
2. You'll see:
   - The Radar chart with your 6 life-area scores
   - Friction points (contradictions the agent found)
   - Thinking sparks (connections between dead and active notes)
   - The Shadow Question

### Phase 5: Review Drafts

If the agent proposed changes to any of your notes:
1. You'll see a green **"You have pending Drafts"** banner on the dashboard
2. Click it (or run `Synapse OS: Review Pending Draft`)
3. Review the diff: green = additions, red = removals
4. Click **Accept & Merge** or **Discard Draft**

---

## 6. Understanding the Dashboard

### The Radar Chart

The 6-axis radar measures where you spend your **cognitive energy**, not just where you have notes:

| Axis | What it Measures |
|:---|:---|
| **Health** | Notes about fitness, diet, mental health, sleep, wellness |
| **Career** | Work projects, professional development, job-related notes |
| **Intellect** | Learning, research, courses, technical knowledge |
| **Hobbies** | Personal interests, side projects, recreational activities |
| **Creativity** | Art, writing, music, design, creative expression |
| **Purpose** | Life goals, philosophy, existential questions, long-term vision |

**Scoring formula:**
```
Score = (WriteTime × 0.7) + (ReadTime × 0.3)
```

Why? Because **writing** a workout plan shows 10× more engagement than **reading** a fitness article.

### Friction Points

These are contradictions the agent found in your vault:
- **Major Crisis** = two notes with high certainty that directly conflict
- **Minor Tension** = a vague note that contradicts a solid one
- Each friction point has a proposed resolution in the Draft Buffer

### Thinking Sparks

Connections between:
- A **high-activity** current note
- A **dead** note (6+ months of inactivity) from a different life category

Purpose: Prevents your vault from becoming a "knowledge cemetery."

### The Shadow Question

The most uncomfortable truth the agent can find about your behavior patterns. If it's not uncomfortable, the system isn't working.

---

## 7. Daily Workflow

### Recommended Rhythm

| Frequency | Action | Command |
|:---|:---|:---|
| **Daily** | Use Obsidian normally (plugin captures data automatically) | — |
| **Weekly** | Run a brain scan | `@synapse-brain` |
| **Bi-weekly** | Run a life strategy session | `@synapse-life` |
| **Monthly** | Full re-index (agent does this automatically) | `@synapse-brain` (triggers if overdue) |

### A Typical Session

1. Open your AI IDE
2. `@synapse-brain` → Review 3 friction points → Accept/Discard drafts
3. Reflect on the Shadow Question (journal about it if you want)
4. Explore the Thinking Spark (open the linked dead note, see if there's a synergy)
5. Repeat next week

### Tips

- **Don't resolve all friction points at once.** The Rule of Three ensures there are always 3 active. When you resolve one, the agent automatically scans for a new one.
- **Answer the Shadow Question honestly.** The agent stores your response in `User_Profile.md` and uses it to ask better questions next time.
- **The agent never touches your notes directly.** Everything goes through Draft Buffer first.

---

## 8. Troubleshooting

### Radar Chart Shows All Zeros

- **Cause:** Not enough telemetry data yet
- **Fix:** Use Obsidian for a few hours with the plugin enabled, then run `@synapse-brain`

### Agent Can't Find Vault Files

- **Cause:** The IDE workspace doesn't include your vault directory
- **Fix:** Add your vault as a workspace folder, or use the symlink strategy above

### Dashboard is Empty

- **Cause:** The agent hasn't created `Dashboard_Data.md` yet
- **Fix:** Copy `templates/Dashboard_Data.md` to `<vault>/_Synapse/Dashboard_Data.md`, then run `@synapse-brain`

### Draft Review Shows "Format Invalid"

- **Cause:** The agent didn't write the Draft Buffer in the expected format
- **Fix:** Delete `Draft_Buffer.md` content and re-run `@synapse-brain`

### Plugin Not Appearing in Obsidian

- **Cause:** Files not in the correct directory
- **Fix:** Ensure all 3 files (`main.js`, `manifest.json`, `styles.css`) are in `.obsidian/plugins/synapse-os/` and restart Obsidian

### Skills Not Showing in IDE

- **Cause:** Skills not in the correct directory structure
- **Fix:** Ensure `.agent/skills/synapse-os/SKILL.md` exists in your workspace root

---

## Next Steps

- Read the [README](../README.md) for the full philosophy behind Synapse OS
- Check the [Contributing Guide](CONTRIBUTING.md) if you want to extend the system
- Join the conversation on [GitHub Discussions](https://github.com/macek166/Synapse-OS/discussions)

---

<p align="center">
  <em>Your vault already knows the truth. Synapse OS just says it out loud.</em>
</p>
