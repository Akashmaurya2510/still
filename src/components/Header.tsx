import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { IconButton } from "./IconButton";

export function Header() {
  const theme = useAppStore((s) => s.theme);
  const tasks = useAppStore((s) => s.tasks);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;
  const completed = total - activeCount;
  const progress = total === 0 ? 0 : completed / total;

  return (
    <header className="flex items-center justify-between gap-3 px-1">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-medium tracking-tight text-fg">
          Still
        </h1>
        {total > 0 && (
          <div
            className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1"
            aria-label={`${completed} of ${total} completed`}
          >
            <div className="h-1 w-10 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-fg transition-[width] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-medium tabular-nums tracking-wide text-muted">
              {completed}/{total}
            </span>
          </div>
        )}
      </div>

      <IconButton
        label={theme === "oled" ? "Switch to light mode" : "Switch to OLED mode"}
        onClick={toggleTheme}
      >
        {theme === "oled" ? (
          <Sun className="size-5" strokeWidth={1.75} />
        ) : (
          <Moon className="size-5" strokeWidth={1.75} />
        )}
      </IconButton>
    </header>
  );
}
