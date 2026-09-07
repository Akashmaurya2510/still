import { useRef, useState } from "react";
import { Check, Star, Trash2 } from "lucide-react";
import { formatDue, isOverdue } from "@/lib/dates";
import { useAppStore, type Task } from "@/lib/store";
import { cn, haptic } from "@/lib/utils";

type Props = { task: Task };

export function TaskItem({ task }: Props) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const toggleStar = useAppStore((s) => s.toggleStar);

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [notesOpen, setNotesOpen] = useState(false);
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);

  const due = formatDue(task.dueAt);
  const overdue = isOverdue(task.dueAt, task.completed);

  function finishEdit() {
    setEditing(false);
    updateTask(task.id, { title: editValue });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (editing) return;
    startX.current = e.clientX;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startX.current == null) return;
    const next = Math.max(-96, Math.min(96, e.clientX - startX.current));
    setDx(next);
  }

  function onPointerUp() {
    if (startX.current == null) return;
    if (dx > 72) {
      toggleTask(task.id);
      haptic(14);
    } else if (dx < -72) {
      deleteTask(task.id);
      haptic(18);
    }
    startX.current = null;
    setDx(0);
  }

  return (
    <li className="relative">
      <div className="absolute inset-y-1 left-2 right-2 flex items-center justify-between rounded-2xl px-4">
        <span className={cn("text-xs font-medium", dx > 24 ? "text-fg" : "text-muted")}>
          {task.completed ? "Undo" : "Done"}
        </span>
        <span className={cn("text-xs font-medium", dx < -24 ? "text-danger" : "text-muted")}>
          Delete
        </span>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ transform: `translateX(${dx}px)` }}
        className={cn(
          "glass relative flex flex-col rounded-2xl px-3.5 py-3",
          "transition-transform duration-150 ease-[var(--ease-out-smooth)]",
          dx === 0 && "transition-transform",
        )}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={task.completed ? "Mark as active" : "Mark as complete"}
            onClick={() => {
              toggleTask(task.id);
              haptic(10);
            }}
            className={cn(
              "relative flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
              "after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-1/2",
              task.completed
                ? "border-fg bg-fg text-bg"
                : "border-muted/60 hover:border-fg/50",
            )}
          >
            {task.completed && <Check className="size-3.5" strokeWidth={2.5} />}
          </button>

          {editing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={finishEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") finishEdit();
                if (e.key === "Escape") {
                  setEditValue(task.title);
                  setEditing(false);
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-base text-fg outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditValue(task.title);
                setEditing(true);
              }}
              onDoubleClick={() => setNotesOpen((v) => !v)}
              className={cn(
                "min-w-0 flex-1 text-left text-base leading-snug",
                task.completed ? "text-muted line-through" : "text-fg",
              )}
            >
              {task.title}
            </button>
          )}

          <button
            type="button"
            aria-label={task.starred ? "Unstar" : "Star"}
            onClick={() => toggleStar(task.id)}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              task.starred ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            <Star className={cn("size-4", task.starred && "fill-current")} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            aria-label="Delete task"
            onClick={() => deleteTask(task.id)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-fg/8 hover:text-fg"
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {(due || task.notes || notesOpen) && (
          <div className="mt-2 ml-9 flex flex-wrap items-center gap-2">
            {due && (
              <span
                className={cn(
                  "rounded-pill px-2 py-0.5 text-xs font-medium",
                  overdue ? "bg-danger/15 text-danger" : "bg-fg/6 text-muted",
                )}
              >
                {due}
              </span>
            )}
            <button
              type="button"
              onClick={() => setNotesOpen((v) => !v)}
              className="text-xs text-muted hover:text-fg"
            >
              {notesOpen ? "Hide note" : task.notes ? "Note" : "Add note"}
            </button>
          </div>
        )}

        {notesOpen && (
          <textarea
            value={task.notes}
            onChange={(e) => updateTask(task.id, { notes: e.target.value })}
            placeholder="A quiet note…"
            rows={2}
            className="mt-2 ml-9 w-[calc(100%-2.25rem)] resize-none rounded-xl bg-fg/5 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted"
          />
        )}
      </div>
    </li>
  );
}
