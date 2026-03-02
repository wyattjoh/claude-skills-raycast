import { List, ActionPanel, Action } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import matter from "gray-matter";

interface Skill {
  name: string;
  directory: string;
  path: string;
  body: string;
}

const SKILLS_DIR = join(homedir(), ".claude", "skills");

function loadSkills(): Skill[] {
  const entries = readdirSync(SKILLS_DIR, { withFileTypes: true });

  const skills: Skill[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = join(SKILLS_DIR, entry.name, "SKILL.md");
    let raw: string;
    try {
      raw = readFileSync(skillPath, "utf-8");
    } catch {
      continue;
    }

    const { data, content } = matter(raw);
    if (!data.name) continue;

    skills.push({
      name: data.name as string,
      directory: entry.name,
      path: skillPath,
      body: content.trim(),
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
