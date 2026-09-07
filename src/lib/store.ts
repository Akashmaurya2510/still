import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import { addDays, startOfDay } from "@/lib/dates";

export type ListId = "inbox" | "personal" | "work";
export type Filter = "all" | "active" | "completed";
export type Theme = "oled" | "light";
export type ListScope = "all" | "starred" | ListId;
export type View = "tasks" | "report";

export type Task = {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  starred: boolean;
  dueAt: number | null;
  listId: ListId;
};

export const LISTS: { id: ListScope; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "starred", label: "Starred" },
  { id: "inbox", label: "Inbox" },
  { id: "personal", label: "Personal" },
  { id: "work", label: "Work" },
];

export const LIST_LABELS: Record<ListId, string> = {
  inbox: "Inbox",
  personal: "Personal",
  work: "Work",
};

type Persisted = {
  tasks: Task[];
  theme: Theme;
  filter: Filter;
  listScope: ListScope;
  profileName: string;
};

type AppState = Persisted & {
  hydrated: boolean;
  settingsOpen: boolean;
  view: View;
  setView: (view: View) => void;
  addTask: (title: string, extras?: Partial<Pick<Task, "listId" | "dueAt" | "starred">>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  clearCompleted: () => void;
  setFilter: (filter: Filter) => void;
  setListScope: (scope: ListScope) => void;
  setSearch: (q: string) => void;
  search: string;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleStar: (id: string) => void;
  setHydrated: () => void;
  setProfileName: (name: string) => void;
  setSettingsOpen: (open: boolean) => void;
  replaceFromBackup: (data: { tasks: Task[]; profileName?: string; theme?: Theme }) => void;
};

function seedTasks(): Task[] {
  const now = Date.now();
  const today = startOfDay(now);
  const day = 86_400_000;
  return [
    {
      id: "seed-1",
      title: "Review the week and pick three priorities",
      notes: "Keep it short. Three is enough.",
      completed: false,
      createdAt: now - day,
      starred: true,
      dueAt: addDays(0),
      listId: "inbox",
    },
    {
      id: "seed-2",
      title: "Clear the desk, then sit for ten quiet minutes",
      notes: "",
      completed: false,
      createdAt: now - 3_600_000,
      starred: false,
      dueAt: addDays(0),
      listId: "personal",
    },
    {
      id: "seed-3",
      title: "Draft the proposal outline",
      notes: "Problem, approach, next step.",
      completed: false,
      createdAt: now - 7_200_000,
      starred: false,
      dueAt: addDays(1),
      listId: "work",
    },
    {
      id: "seed-4",
      title: "Send the weekly recap",
      notes: "",
      completed: true,
      createdAt: today - 2 * 3600_000,
      completedAt: now - 2 * 3600_000,
      starred: false,
      dueAt: today,
      listId: "work",
    },
    {
      id: "seed-5",
      title: "Water the plants",
      notes: "",
      completed: true,
      createdAt: today - day,
      completedAt: today - day + 9 * 3600_000,
      starred: false,
      dueAt: today - day,
      listId: "personal",
    },
    {
      id: "seed-6",
      title: "Read twenty pages",
      notes: "",
      completed: true,
      createdAt: today - 2 * day,
      completedAt: today - 2 * day + 21 * 3600_000,
      starred: false,
      dueAt: null,
      listId: "personal",
    },
    {
      id: "seed-7",
      title: "Inbox to zero before lunch",
      notes: "",
      completed: true,
      createdAt: today - 3 * day,
      completedAt: today - 3 * day + 11 * 3600_000,
      starred: false,
      dueAt: today - 3 * day,
      listId: "inbox",
    },
    {
      id: "seed-8",
      title: "Sketch the landing page",
      notes: "",
      completed: true,
      createdAt: today - 4 * day,
      completedAt: today - 4 * day + 16 * 3600_000,
      starred: true,
      dueAt: null,
      listId: "work",
    },
  ];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: seedTasks(),
      filter: "all",
      listScope: "all",
      theme: "oled",
      search: "",
      profileName: "",
      hydrated: false,
      settingsOpen: false,
      view: "tasks",
      setView: (view) => set({ view }),

      addTask: (title, extras) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const scope = get().listScope;
        const listId: ListId =
          extras?.listId ?? (scope === "all" || scope === "starred" ? "inbox" : scope);
        const task: Task = {
          id: uid(),
          title: trimmed,
          notes: "",
          completed: false,
          createdAt: Date.now(),
          starred: extras?.starred ?? get().listScope === "starred",
          dueAt: extras?.dueAt ?? null,
          listId,
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
      },

      toggleTask: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? Date.now() : undefined,
                }
              : t,
          ),
        }));
      },

      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      },

      updateTask: (id, patch) => {
        if (patch.title !== undefined && !patch.title.trim()) {
          get().deleteTask(id);
          return;
        }
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
      },

      clearCompleted: () => {
        set((s) => ({ tasks: s.tasks.filter((t) => !t.completed) }));
      },

      setFilter: (filter) => set({ filter }),
      setListScope: (listScope) => set({ listScope }),
      setSearch: (search) => set({ search }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "oled" ? "light" : "oled" })),
      setTheme: (theme) => set({ theme }),
      toggleStar: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t)),
        }));
      },
      setHydrated: () => set({ hydrated: true }),
      setProfileName: (profileName) => set({ profileName: profileName.trim().slice(0, 40) }),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
      replaceFromBackup: (data) => {
        set({
          tasks: data.tasks,
          profileName: data.profileName ?? get().profileName,
          theme: data.theme ?? get().theme,
        });
      },
    }),
    {
      name: "still-tasks-v2",
      skipHydration: true,
      version: 3,
      partialize: (s) => ({
        tasks: s.tasks,
        theme: s.theme,
        filter: s.filter,
        listScope: s.listScope,
        profileName: s.profileName,
      }),
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        return {
          tasks: Array.isArray(p.tasks) ? p.tasks : seedTasks(),
          theme: p.theme === "light" ? "light" : "oled",
          filter: p.filter === "active" || p.filter === "completed" ? p.filter : "all",
          listScope: p.listScope ?? "all",
          profileName: typeof p.profileName === "string" ? p.profileName : "",
        };
      },
    },
  ),
);
