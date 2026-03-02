# Claude Skills & Agents for Raycast

A [Raycast](https://raycast.com) extension to search and browse your [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills and agents.

## Commands

### Search Claude Skills

Browse skills from `~/.claude/skills/*/SKILL.md`. Each skill is displayed with its `/slash-command` name, a detail preview of the markdown body, and quick actions to copy or open the file.

### Search Claude Agents

Browse agents from `~/.claude/agents/*.md`. Each agent is displayed with its `@mention` name, a detail preview, and quick actions. Agents with a `color` front matter field show a tinted icon.

## Actions

Both commands support:

- **Copy name** (Enter) — copies the prefixed name (`/skill` or `@agent`) to clipboard
- **Open file** — opens the source markdown file in your editor
- **Copy raw name** — copies the name without the prefix

Search filters across front matter fields and markdown body content.

## Development

```sh
npm install
npm run dev
```

## License

MIT
