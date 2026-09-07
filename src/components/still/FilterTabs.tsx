import { useEffect, useRef, useState } from "react";
import { useAppStore, type Filter } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Done" },
];

export function FilterTabs() {
  const filter = useAppStore((s) => s.filter);
  const setFilter = useAppStore((s) => s.setFilter);
  const tasks = useAppStore((s) => s.tasks);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ x: 0, w: 0 });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  useEffect(() => {
    const measure = () => {
      const btn = btnRefs.current[filter];
      const wrap = wrapRef.current;
      if (!btn || !wrap) return;
      const wr = wrap.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const x = br.left - wr.left;
      const w = br.width;
      setPill((prev) => (prev.x === x && prev.w === w ? prev : { x, w }));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter, tasks.length]);

  return (
    <div
      ref={wrapRef}
      className="glass relative grid grid-cols-3 rounded-2xl p-1.5"
      role="tablist"
      aria-label="Task status"
    >
      <div
        aria-hidden
        className="glass-strong pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl transition-[transform,width] duration-250 ease-[var(--ease-out-smooth)]"
        style={{ width: pill.w || undefined, transform: `translateX(${pill.x}px)` }}
      />
      {TABS.map((tab) => {
        const active = filter === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              btnRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "relative z-10 flex min-h-12 flex-col items-center justify-center rounded-xl px-2 py-2",
              "text-sm font-medium tracking-wide transition-colors duration-150",
              active ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            <span>{tab.label}</span>
            <span className="text-xs font-normal tabular-nums opacity-70">{counts[tab.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
