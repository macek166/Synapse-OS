# Contributing to Synapse OS

Thank you for your interest in contributing to Synapse OS! This project is at the intersection of personal knowledge management and AI-augmented cognition, and there's a lot of room to grow.

## How to Contribute

### 🐛 Bug Reports
Open an [issue](https://github.com/macek166/Synapse-OS/issues) with:
- Obsidian version
- Your IDE name and version
- Steps to reproduce
- Expected vs actual behavior

### 💡 Feature Requests
Open an issue tagged `enhancement`. Describe the use case, not just the feature.

### 🔧 Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Build and test: `npm run build`
5. Submit a PR with a clear description

## Development Setup

```bash
git clone https://github.com/macek166/Synapse-OS.git
cd Synapse-OS
npm install
npm run dev    # Watch mode — rebuilds on save
```

The plugin source is in `src/`. After building, copy `main.js` to your vault's `.obsidian/plugins/synapse-os/` to test.

## Key Areas for Contribution

| Area | Description | Difficulty |
|:---|:---|:---|
| **Radar Categories** | Add configurable categories beyond the default 6 | Medium |
| **Epistemic Scoring** | NLP-based certainty detection instead of simple heuristics | Hard |
| **Mobile Support** | Optimize telemetry for Obsidian Mobile | Medium |
| **Settings UI** | Proper Obsidian settings tab for configuration | Easy |
| **Localization** | i18n for the plugin UI (skills are language-agnostic) | Easy |
| **Visualization** | Better chart types, historical tracking | Medium |
| **Agent Skills** | New skills for specific use cases (study, research, journaling) | Easy |

## Code Style

- TypeScript with strict null checks
- Follow existing patterns in the codebase
- Keep modules focused and single-responsibility
- Comment non-obvious logic

## Agent Skill Guidelines

When contributing new skills:
- Use the YAML frontmatter format with `name`, `version`, `description`, `target_environment`
- Write in English
- Reference the core `synapse-os/SKILL.md` for shared protocols
- Test with at least 2 different IDEs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
