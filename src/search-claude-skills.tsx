import { List, ActionPanel, Action } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import {
  type MarkdownEntry,
  extractKeywords,
  parseMarkdownFile,
} from "./shared";

interface Skill extends MarkdownEntry {
  directory: string;
}

const SKILLS_DIR = join(homedir(), ".claude", "skills");

function loadSkills(): Skill[] {
  const entries = readdirSync(SKILLS_DIR, { withFileTypes: true });

  const skills: Skill[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = join(SKILLS_DIR, entry.name, "SKILL.md");
    const parsed = parseMarkdownFile(skillPath);
    if (!parsed) continue;

    const { data, content } = parsed;
    if (!data.name) continue;

    skills.push({
      name: data.name as string,
      directory: entry.name,
      path: skillPath,
      body: content.trim(),
      keywords: extractKeywords(data, content),
    });
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));

  return skills;
}

export default function SearchClaudeSkills() {
  const { data: skills, isLoading } = usePromise(async () => loadSkills());

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      searchBarPlaceholder="Search Claude skills..."
    >
      {skills?.map((skill) => (
        <List.Item
          key={skill.directory}
          title={`/${skill.directory}`}
          keywords={skill.keywords}
          detail={<List.Item.Detail markdown={skill.body} />}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy Slash Command"
                content={`/${skill.name}`}
              />
              <Action.Open title="Open SKILL.md" target={skill.path} />
              <Action.Open
                title="Open Skill Directory"
                target={join(SKILLS_DIR, skill.directory)}
              />
              <Action.CopyToClipboard
                title="Copy Skill Name"
                content={skill.name}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
