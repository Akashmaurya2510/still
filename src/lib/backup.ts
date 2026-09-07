import { z } from "zod";
import type { Task, Theme } from "@/lib/store";

const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  notes: z.string().default(""),
  completed: z.boolean(),
  createdAt: z.number(),
  completedAt: z.number().optional(),
  starred: z.boolean().default(false),
  dueAt: z.number().nullable().default(null),
  listId: z.enum(["inbox", "personal", "work"]).default("inbox"),
});

const backupSchema = z.object({
  version: z.literal(1),
  app: z.literal("still"),
  exportedAt: z.number(),
  profileName: z.string().default(""),
  theme: z.enum(["oled", "light"]).default("oled"),
  tasks: z.array(taskSchema),
});

export type StillBackup = {
  version: 1;
  app: "still";
  exportedAt: number;
  profileName: string;
  theme: Theme;
  tasks: Task[];
};

export function makeBackup(input: {
  tasks: Task[];
  profileName: string;
  theme: Theme;
}): StillBackup {
  return {
    version: 1,
    app: "still",
    exportedAt: Date.now(),
    profileName: input.profileName,
    theme: input.theme,
    tasks: input.tasks,
  };
}

export function parseBackup(raw: unknown): StillBackup {
  if (raw && typeof raw === "object" && "state" in raw) {
    const nested = (raw as { state?: unknown }).state;
    return parseBackup(nested);
  }

  if (raw && typeof raw === "object" && "tasks" in raw && !("app" in raw)) {
    const loose = raw as { tasks: unknown; profileName?: unknown; theme?: unknown };
    return backupSchema.parse({
      version: 1,
      app: "still",
      exportedAt: Date.now(),
      profileName: typeof loose.profileName === "string" ? loose.profileName : "",
      theme: loose.theme === "light" ? "light" : "oled",
      tasks: loose.tasks,
    });
  }

  return backupSchema.parse(raw);
}

export function downloadBackup(backup: StillBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date(backup.exportedAt);
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  a.href = url;
  a.download = `still-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function readBackupFile(file: File): Promise<StillBackup> {
  const text = await file.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("That file is not valid JSON.");
  }
  try {
    return parseBackup(json);
  } catch {
    throw new Error("This does not look like a Still backup.");
  }
}
