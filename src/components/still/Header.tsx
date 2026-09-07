import { greeting } from "@/lib/dates";
import { useAppStore } from "@/lib/store";
import { HeaderActions } from "./HeaderActions";

type Props = {
  searching: boolean;
  onToggleSearch: () => void;
};

export function Header({ searching, onToggleSearch }: Props) {
  const tasks = useAppStore((s) => s.tasks);
  const profileName = useAppStore((s) => s.profileName);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;
  const completed = total - activeCount;
  const progress = total === 0 ? 0 : completed / total;

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const hello = profileName.trim()
    ? `${greeting()}, ${profileName.trim()}`
    : `${greeting()}`;

  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted">{dateLabel}</p>
        <h1 className="font-display mt-0.5 text-3xl font-medium tracking-tight text-fg sm:text-4xl">
          Still
        </h1>
        <p className="mt-0.5 truncate text-sm text-muted">{hello}.</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {total > 0 && (
          <div
            className="glass mr-1 hidden items-center gap-2 rounded-pill px-3 py-1.5 sm:flex"
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
        <HeaderActions searching={searching} onToggleSearch={onToggleSearch} />
      </div>
    </header>
  );
}
