import { BarChart3, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, type View } from "@/lib/store";

export function TabBar() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="pointer-events-auto glass-strong mx-auto flex max-w-sm items-center justify-around rounded-pill p-1.5">
        <Tab active={view === "tasks"} label="Tasks" onClick={() => setView("tasks")}>
          <CheckSquare className="size-5" strokeWidth={1.75} />
        </Tab>
        <Tab active={view === "report"} label="Report" onClick={() => setView("report")}>
          <BarChart3 className="size-5" strokeWidth={1.75} />
        </Tab>
      </div>
    </nav>
  );
}

function Tab({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-12 min-w-24 flex-1 flex-col items-center justify-center gap-0.5 rounded-pill px-4 py-1.5",
        "text-xs font-medium transition-[background-color,color,transform] duration-200 ease-[var(--ease-spring)] active:scale-[0.95]",
        active ? "bg-fg/10 text-fg" : "text-muted",
      )}
    >
      {children}
      {label}
    </button>
  );
}
