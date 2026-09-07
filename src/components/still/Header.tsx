import { Moon, Search, Sun, X } from "lucide-react";
import { greeting } from "@/lib/dates";
import { useAppStore } from "@/lib/store";
import { IconButton } from "./IconButton";

type Props = {
  searching: boolean;
  onToggleSearch: () => void;
};

export function Header({ searching, onToggleSearch }: Props) {
  const theme = useAppStore((s) => s.theme);
  const tasks = useAppStore((s) => s.tasks);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;
  const completed = total - activeCount;
  const progress = total === 0 ? 0 : completed / total;

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted">{dateLabel}</p>
        <h1 className="font-display mt-0.5 text-3xl font-medium tracking-tight text-fg">
          Still
        </h1>
        <p className="mt-0.5 text-sm text-muted">{greeting()}.</p>
      </div>

      <div className="flex items-center gap-1">
        {total > 0 && (
          <div
            className="glass mr-1 flex items-center gap-2 rounded-pill px-3 py-1.5"
            aria-label={`${completed} of ${total} completed`}
          >
            <div className="h-1.5 w-11 overflow-hidden rounded-pill bg-fg/10">
              <div
                className="h-full rounded-pill bg-fg transition-[width] duration-400 ease-[var(--ease-out-smooth)]"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium tabular-nums tracking-wide text-fg">
              {completed}/{total}
            </span>
          </div>
        )}

        <IconButton
          label={searching ? "Close search" : "Search"}
          onClick={onToggleSearch}
        >
          {searching ? (
            <X className="size-5" strokeWidth={1.75} />
          ) : (
            <Search className="size-5" strokeWidth={1.75} />
          )}
        </IconButton>

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
      </div>
    </header>
  );
}
