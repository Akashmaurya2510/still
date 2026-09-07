import { AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { TaskItem } from "./TaskItem";
import { cn } from "@/lib/utils";

export function TaskList() {
  const tasks = useAppStore((s) => s.tasks);
  const filter = useAppStore((s) => s.filter);
  const setFilter = useAppStore((s) => s.setFilter);
  const clearCompleted = useAppStore((s) => s.clearCompleted);

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Filters */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex gap-1 rounded-full border border-border p-0.5">
          {(
            [
              ["all", "All"],
              ["active", "Active"],
              ["completed", "Done"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === key
                  ? "bg-fg text-bg"
                  : "text-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="text-xs text-muted transition-colors hover:text-fg"
          >
            Clear done
          </button>
        )}
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {filtered.length === 0 ? (
          <EmptyState filter={filter} hasAny={tasks.length > 0} />
        ) : (
          <ul className="flex flex-col gap-2 pb-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((task, i) => (
                <TaskItem key={task.id} task={task} index={i} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Footer hint */}
      {tasks.length > 0 && (
        <p className="pb-1 text-center text-[11px] text-muted/70">
          {activeCount === 0
            ? "All clear. Enjoy the quiet."
            : `${activeCount} remaining · press N to add`}
        </p>
      )}
    </div>
  );
}

function EmptyState({
  filter,
  hasAny,
}: {
  filter: string;
  hasAny: boolean;
}) {
  let title = "Nothing here yet";
  let subtitle = "Add your first task above.";

  if (hasAny) {
    if (filter === "active") {
      title = "All done";
      subtitle = "Every task is complete.";
    } else if (filter === "completed") {
      title = "No completed tasks";
      subtitle = "Finish something to see it here.";
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="font-display text-xl text-fg/90">{title}</p>
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
}
