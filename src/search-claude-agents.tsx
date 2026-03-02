import { List, ActionPanel, Action, Color, Icon } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";
import {
  type MarkdownEntry,
  extractKeywords,
  parseMarkdownFile,
} from "./shared";

interface Agent extends MarkdownEntry {
  slug: string;
  color?: string;
}

const AGENTS_DIR = join(homedir(), ".claude", "agents");

function loadAgents(): Agent[] {
  let entries: string[];
  try {
    entries = readdirSync(AGENTS_DIR);
  } catch {
    return [];
  }

  const agents: Agent[] = [];

  for (const filename of entries) {
    if (!filename.endsWith(".md")) continue;

    const filePath = join(AGENTS_DIR, filename);
    const parsed = parseMarkdownFile(filePath);
    if (!parsed) continue;

    const { data, content } = parsed;
    const slug = basename(filename, ".md");
    const name = typeof data.name === "string" ? data.name : slug;

    agents.push({
      name,
      slug,
      path: filePath,
      body: content.trim(),
      keywords: extractKeywords(data, content),
      color: typeof data.color === "string" ? data.color : undefined,
    });
  }

  agents.sort((a, b) => a.name.localeCompare(b.name));

  return agents;
}

export default function SearchClaudeAgents() {
  const { data: agents, isLoading } = usePromise(async () => loadAgents());

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      searchBarPlaceholder="Search Claude agents..."
    >
      {agents?.map((agent) => (
        <List.Item
          key={agent.slug}
          title={`@${agent.slug}`}
          keywords={agent.keywords}
          icon={
            agent.color
              ? { source: Icon.CircleFilled, tintColor: agent.color as Color }
              : undefined
          }
          detail={<List.Item.Detail markdown={agent.body} />}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy Agent Mention"
                content={`@${agent.slug}`}
              />
              <Action.Open title="Open Agent File" target={agent.path} />
              <Action.CopyToClipboard
                title="Copy Agent Name"
                content={agent.name}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
