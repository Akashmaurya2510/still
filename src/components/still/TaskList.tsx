import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const tasks = useAppStore((s) => s.tasks);
  const filter = useAppStore((s) => s.filter);
  const listScope = useAppStore((s) => s.listScope);
  const search = useAppStore((s) => s.search);
  const clearCompleted = useAppStore((s) => s.clearCompleted);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter === "active" && t.completed) return false;
      if (filter === "completed" && !t.completed) return false;
      if (listScope === "starred" && !t.starred) return false;
      if (listScope !== "all" && listScope !== "starred" && t.listId !== listScope)
        return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.notes.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [tasks, filter, listScope, search]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-end px-0.5">
        {completedCount > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="text-sm text-muted transition-colors hover:text-fg"
          >
            Clear done
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {visible.length === 0 ? (
          <EmptyState
            filter={filter}
            hasAny={tasks.length > 0}
            searching={search.trim().length > 0}
            scoped={listScope !== "all"}
          />
        ) : (
          <ul className="flex flex-col gap-2.5 pb-8">
            {visible.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>

      {tasks.length > 0 && (
        <p className="pb-1 text-center text-xs text-muted/80">
          {activeCount === 0
            ? "All clear. Enjoy the quiet."
            : `${activeCount} remaining · N to add · swipe to complete`}
        </p>
      )}
    </div>
  );
}

function EmptyState({
  filter,
  hasAny,
  searching,
  scoped,
}: {
  filter: string;
  hasAny: boolean;
  searching: boolean;
  scoped: boolean;
}) {
  let title = "Nothing here yet";
  let subtitle = "Add your first task above.";

  if (searching) {
    title = "No matches";
    subtitle = "Try a different word.";
  } else if (hasAny) {
    if (filter === "active") {
      title = "All done";
      subtitle = "Every task is complete.";
    } else if (filter === "completed") {
      title = "No completed tasks";
      subtitle = "Finish something to see it here.";
    } else if (scoped) {
      title = "This list is empty";
      subtitle = "Add a task, or switch lists.";
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="font-display text-2xl text-fg/90">{title}</p>
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
}
