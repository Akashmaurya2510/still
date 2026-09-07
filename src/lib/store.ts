import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import { addDays } from "@/lib/dates";

export type ListId = "inbox" | "personal" | "work";
export type Filter = "all" | "active" | "completed";
export type Theme = "oled" | "light";
export type ListScope = "all" | "starred" | ListId;

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

type AppState = {
  tasks: Task[];
  filter: Filter;
  listScope: ListScope;
  theme: Theme;
  search: string;
  hydrated: boolean;
  addTask: (title: string, extras?: Partial<Pick<Task, "listId" | "dueAt" | "starred">>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  clearCompleted: () => void;
  setFilter: (filter: Filter) => void;
  setListScope: (scope: ListScope) => void;
  setSearch: (q: string) => void;
  toggleTheme: () => void;
  toggleStar: (id: string) => void;
  setHydrated: () => void;
};

function seedTasks(): Task[] {
  const now = Date.now();
  return [
    {
      id: uid(),
      title: "Review the week and pick three priorities",
      notes: "Keep it short. Three is enough.",
      completed: false,
      createdAt: now - 86_400_000,
      starred: true,
      dueAt: addDays(0),
      listId: "inbox",
    },
    {
      id: uid(),
      title: "Clear the desk, then sit for ten quiet minutes",
      notes: "",
      completed: false,
      createdAt: now - 3_600_000,
      starred: false,
      dueAt: addDays(0),
      listId: "personal",
    },
    {
      id: uid(),
      title: "Draft the proposal outline",
      notes: "Problem, approach, next step.",
      completed: false,
      createdAt: now - 7_200_000,
      starred: false,
      dueAt: addDays(1),
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
      hydrated: false,

      addTask: (title, extras) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const scope = get().listScope;
        const listId: ListId =
          extras?.listId ??
          (scope === "all" || scope === "starred" ? "inbox" : scope);
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
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "oled" ? "light" : "oled" })),
      toggleStar: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, starred: !t.starred } : t,
          ),
        }));
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "still-tasks-v2",
      skipHydration: true,
      partialize: (s) => ({
        tasks: s.tasks,
        theme: s.theme,
        filter: s.filter,
        listScope: s.listScope,
      }),
    },
  ),
);

