import { useEffect, useRef, useState } from "react";
import { Calendar, Plus, Star } from "lucide-react";
import { addDays } from "@/lib/dates";
import { useAppStore } from "@/lib/store";
import { cn, haptic } from "@/lib/utils";

export function TaskInput() {
  const [value, setValue] = useState("");
  const [starred, setStarred] = useState(false);
  const [due, setDue] = useState<"none" | "today" | "tomorrow">("none");
  const addTask = useAppStore((s) => s.addTask);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function submit() {
    if (!value.trim()) return;
    const dueAt = due === "today" ? addDays(0) : due === "tomorrow" ? addDays(1) : null;
    addTask(value, { starred, dueAt });
    haptic(10);
    setValue("");
    setStarred(false);
    setDue("none");
  }

  return (
    <div className="glass rounded-2xl p-2">
      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
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
          placeholder="Add a task"
          className={cn(
            "w-full rounded-xl bg-transparent py-3 pl-11 pr-3",
            "text-base text-fg placeholder:text-muted",
            "outline-none",
          )}
          autoComplete="off"
          enterKeyHint="done"
        />
      </div>
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-1 pb-1 pt-0.5">
        <Chip active={starred} onClick={() => setStarred((v) => !v)}>
          <Star className={cn("size-3.5", starred && "fill-current")} strokeWidth={1.75} />
          Star
        </Chip>
        <Chip
          active={due === "today"}
          onClick={() => setDue((d) => (d === "today" ? "none" : "today"))}
        >
          <Calendar className="size-3.5" strokeWidth={1.75} />
          Today
        </Chip>
        <Chip
          active={due === "tomorrow"}
          onClick={() => setDue((d) => (d === "tomorrow" ? "none" : "tomorrow"))}
        >
          Tomorrow
        </Chip>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 shrink-0 items-center gap-1.5 rounded-pill px-3 text-xs font-medium",
        "transition-colors duration-150",
        active ? "bg-fg text-bg" : "bg-fg/6 text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
