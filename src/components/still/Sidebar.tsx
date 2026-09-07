import { BarChart3, CheckSquare, Settings, Star } from "lucide-react";
import { LISTS, useAppStore } from "@/lib/store";
import { cn, initials } from "@/lib/utils";

export function Sidebar() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const profileName = useAppStore((s) => s.profileName);
  const listScope = useAppStore((s) => s.listScope);
  const setListScope = useAppStore((s) => s.setListScope);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const tasks = useAppStore((s) => s.tasks);

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border px-3 py-5 lg:flex lg:w-64">
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="glass mb-6 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fg/10 text-xs font-medium">
          {initials(profileName)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-fg">
            {profileName.trim() || "Still"}
          </span>
          <span className="block text-xs text-muted tabular-nums">
            {remaining} open
          </span>
        </span>
      </button>

      <nav className="flex flex-col gap-1" aria-label="Main">
        <NavLink
          active={view === "tasks"}
          icon={<CheckSquare className="size-4" strokeWidth={1.75} />}
          onClick={() => setView("tasks")}
        >
          Tasks
        </NavLink>
        <NavLink
          active={view === "report"}
          icon={<BarChart3 className="size-4" strokeWidth={1.75} />}
          onClick={() => setView("report")}
        >
          Report
        </NavLink>
      </nav>

      {view === "tasks" && (
        <div className="mt-6">
          <p className="mb-2 px-3 text-xs font-medium tracking-wide text-muted">Lists</p>
          <div className="flex flex-col gap-0.5">
            {LISTS.map((list) => {
              const active = listScope === list.id;
              const count =
                list.id === "all"
                  ? tasks.filter((t) => !t.completed).length
                  : list.id === "starred"
                    ? tasks.filter((t) => t.starred && !t.completed).length
                    : tasks.filter((t) => t.listId === list.id && !t.completed).length;
              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => setListScope(list.id)}
                  className={cn(
                    "flex h-10 items-center justify-between rounded-xl px-3 text-sm transition-colors duration-150",
                    active ? "glass-strong text-fg" : "text-muted hover:bg-fg/6 hover:text-fg",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {list.id === "starred" && <Star className="size-3.5" strokeWidth={1.75} />}
                    {list.label}
                  </span>
                  <span className="text-xs tabular-nums opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-muted hover:bg-fg/6 hover:text-fg"
        >
          <Settings className="size-4" strokeWidth={1.75} />
          Settings
        </button>
      </div>
    </aside>
  );
}

function NavLink({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors duration-150",
        active ? "glass-strong text-fg" : "text-muted hover:bg-fg/6 hover:text-fg",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
