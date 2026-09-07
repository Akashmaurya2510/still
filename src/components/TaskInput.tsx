import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TaskInput() {
  const [value, setValue] = useState("");
  const addTask = useAppStore((s) => s.addTask);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "n" &&
        !e.metaKey &&
        !e.ctrlKey &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function submit() {
    if (!value.trim()) return;
    addTask(value);
    setValue("");
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        <Plus className="size-5" strokeWidth={1.75} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Add a task…"
        className={cn(
          "w-full rounded-2xl border border-border bg-surface py-3.5 pl-12 pr-4",
          "text-[15px] text-fg placeholder:text-muted",
          "outline-none transition-[border-color,box-shadow] duration-200",
          "focus:border-fg/30 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--app-fg)_8%,transparent)]",
        )}
        autoComplete="off"
        enterKeyHint="done"
      />
    </div>
  );
}
