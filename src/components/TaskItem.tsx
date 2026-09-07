import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { useAppStore, type Task } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  task: Task;
  index: number;
};

export function TaskItem({ task }: Props) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const updateTask = useAppStore((s) => s.updateTask);

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function finishEdit() {
    setEditing(false);
    updateTask(task.id, editValue);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-center gap-3 rounded-2xl border border-border bg-surface px-3.5 py-3.5"
    >
      <button
        type="button"
        aria-label={task.completed ? "Mark as active" : "Mark as complete"}
        onClick={() => toggleTask(task.id)}
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          task.completed
            ? "border-fg bg-fg text-bg"
            : "border-muted/60 hover:border-fg/50",
        )}
      >
        {task.completed && <Check className="size-3.5" strokeWidth={2.5} />}
      </button>

      {editing ? (
        <input
          ref={inputRef}
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
          className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setEditValue(task.title);
            setEditing(true);
          }}
          className={cn(
            "min-w-0 flex-1 text-left text-[15px] leading-snug transition-colors",
            task.completed ? "text-muted line-through" : "text-fg",
          )}
        >
          {task.title}
        </button>
      )}

      <button
        type="button"
        aria-label="Delete task"
        onClick={() => deleteTask(task.id)}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-muted",
          "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
          "hover:bg-fg/8 hover:text-fg active:bg-fg/12",
          "max-md:opacity-100",
        )}
      >
        <Trash2 className="size-4" strokeWidth={1.75} />
      </button>
    </motion.li>
  );
}
