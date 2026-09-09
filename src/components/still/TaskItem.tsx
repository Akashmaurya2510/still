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
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef(0);
  const axis = useRef<"x" | "y" | null>(null);

  const due = formatDue(task.dueAt);
  const overdue = isOverdue(task.dueAt, task.completed);

  function finishEdit() {
    setEditing(false);
    updateTask(task.id, { title: editValue });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (editing) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startY.current = e.clientY;
    axis.current = null;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startX.current == null) return;
    const ddx = e.clientX - startX.current;
    const ddy = e.clientY - startY.current;
    if (!axis.current) {
      if (Math.abs(ddx) < 8 && Math.abs(ddy) < 8) return;
      axis.current = Math.abs(ddx) > Math.abs(ddy) ? "x" : "y";
      if (axis.current === "x") setDragging(true);
    }
    if (axis.current !== "x") return;
    setDx(Math.max(-96, Math.min(96, ddx)));
  }

  function onPointerUp() {
    if (startX.current == null) return;
    if (axis.current === "x") {
      if (dx > 72) {
        toggleTask(task.id);
        haptic(14);
      } else if (dx < -72) {
        deleteTask(task.id);
        haptic(18);
      }
    }
    startX.current = null;
    axis.current = null;
    setDragging(false);
    setDx(0);
  }

  return (
    <li className="relative">
      <div
        className={cn(
          "absolute inset-y-1 left-2 right-2 flex items-center justify-between overflow-hidden rounded-2xl px-4",
          "transition-colors duration-150",
          dx > 24 ? "bg-fg/12" : dx < -24 ? "bg-danger/15" : "bg-transparent",
        )}
      >
        <span
          className={cn(
            "text-xs font-medium transition-opacity duration-150",
            dx > 24 ? "text-fg opacity-100" : "text-muted opacity-0",
          )}
        >
          {task.completed ? "Undo" : "Done"}
        </span>
        <span
          className={cn(
            "text-xs font-medium transition-opacity duration-150",
            dx < -24 ? "text-danger opacity-100" : "text-muted opacity-0",
          )}
        >
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
          "swipe-row glass relative flex flex-col rounded-2xl px-3 py-2.5",
          "ease-[var(--ease-out-smooth)]",
          dragging ? "transition-none" : "transition-transform duration-200",
        )}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label={task.completed ? "Mark as active" : "Mark as complete"}
            onClick={() => {
              toggleTask(task.id);
              haptic(10);
            }}
            className={cn(
              "relative flex size-6 shrink-0 items-center justify-center rounded-full border-2",
              "transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-spring)] active:scale-90",
              "after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-1/2",
              task.completed ? "border-fg bg-fg text-bg" : "border-muted/60 hover:border-fg/50",
            )}
          >
            {task.completed && (
              <Check className="size-3.5 animate-check-pop" strokeWidth={2.5} />
            )}
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
              "relative flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-[var(--ease-spring)] active:scale-90",
              "touch-hit",
              task.starred ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            <Star className={cn("size-4", task.starred && "fill-current")} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            aria-label="Delete task"
            onClick={() => deleteTask(task.id)}
            className="touch-hit relative hidden size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-fg/8 hover:text-fg sm:flex"
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {(due || task.notes || notesOpen) && (
          <div className="mt-1.5 ml-9 flex flex-wrap items-center gap-2">
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
            className="mt-1.5 ml-9 w-[calc(100%-2.25rem)] resize-none rounded-xl bg-fg/5 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted"
          />
        )}
      </div>
    </li>
  );
}
