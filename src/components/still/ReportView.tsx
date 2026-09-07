import { useMemo } from "react";
import { LIST_LABELS, useAppStore } from "@/lib/store";
import { bestDay, completionStreak, lastNDays, listBreakdown, todayStats } from "@/lib/stats";
import { formatDayLabel, formatTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { HeaderActions } from "./HeaderActions";

export function ReportView() {
  const tasks = useAppStore((s) => s.tasks);
  const profileName = useAppStore((s) => s.profileName);

  const days = useMemo(() => lastNDays(tasks, 14), [tasks]);
  const week = days.slice(-7);
  const today = todayStats(tasks);
  const streak = completionStreak(tasks);
  const lists = listBreakdown(tasks);
  const peak = bestDay(week);
  const weekTotal = week.reduce((n, d) => n + d.completed, 0);
  const maxBar = Math.max(1, ...week.map((d) => d.completed));

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted">{dateLabel}</p>
          <h1 className="font-display mt-0.5 text-3xl font-medium tracking-tight text-fg sm:text-4xl">
            Report
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {profileName.trim() ? `${profileName.trim()}'s daily work` : "How the days added up."}
          </p>
        </div>
        <HeaderActions />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Done today" value={today.completedCount} hint="completed" />
          <StatCard label="Added today" value={today.createdTodayCount} hint="new tasks" />
          <StatCard label="Still open" value={today.remainingCount} hint="remaining" />
        </div>

        <section className="glass mt-3 rounded-2xl p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-fg">Last 7 days</h2>
              <p className="text-xs text-muted">{weekTotal} completed this week</p>
            </div>
            {peak && peak.completed > 0 && (
              <p className="text-xs text-muted">
                Peak {formatDayLabel(peak.ts, { weekday: true })} · {peak.completed}
              </p>
            )}
          </div>
          <div className="flex h-32 items-end gap-1.5 sm:gap-2">
            {week.map((d) => {
              const h = (d.completed / maxBar) * 100;
              const isToday = formatDayLabel(d.ts) === "Today";
              return (
                <div key={d.ts} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-24 w-full items-end justify-center">
                    <div
                      className={cn(
                        "w-full max-w-8 rounded-md transition-[height] duration-400 ease-[var(--ease-out-smooth)]",
                        isToday ? "bg-fg" : "bg-fg/25",
                      )}
                      style={{ height: `${Math.max(d.completed > 0 ? 12 : 4, h)}%` }}
                      title={`${formatDayLabel(d.ts)}: ${d.completed}`}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium tabular-nums",
                      isToday ? "text-fg" : "text-muted",
                    )}
                  >
                    {new Date(d.ts).toLocaleDateString(undefined, { weekday: "narrow" })}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <section className="glass rounded-2xl p-4 sm:p-5">
            <h2 className="text-sm font-medium text-fg">Streak</h2>
            <p className="font-display mt-2 text-4xl font-medium tracking-tight tabular-nums text-fg">
              {streak}
            </p>
            <p className="mt-1 text-sm text-muted">
              {streak === 0
                ? "Complete a task to start a streak."
                : streak === 1
                  ? "day of quiet progress"
                  : "days in a row"}
            </p>
          </section>

          <section className="glass rounded-2xl p-4 sm:p-5">
            <h2 className="text-sm font-medium text-fg">By list</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {lists.map((list) => {
                const pct = list.total === 0 ? 0 : list.completed / list.total;
                return (
                  <li key={list.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-fg">{LIST_LABELS[list.id]}</span>
                      <span className="tabular-nums text-muted">
                        {list.completed}/{list.total}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-pill bg-fg/10">
                      <div
                        className="h-full rounded-pill bg-fg transition-[width] duration-400 ease-[var(--ease-out-smooth)]"
                        style={{ width: `${pct * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <section className="glass mt-3 rounded-2xl p-4 sm:p-5">
          <h2 className="text-sm font-medium text-fg">Finished today</h2>
          {today.completedToday.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              Nothing checked off yet. Finish a task and it will land here.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {today.completedToday
                .slice()
                .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
                .map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-fg/4 px-3 py-2.5"
                  >
                    <span className="min-w-0 truncate text-sm text-fg">{t.title}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      {t.completedAt ? formatTime(t.completedAt) : ""}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-4">
      <p className="text-xs font-medium tracking-wide text-muted">{label}</p>
      <p className="font-display mt-1 text-3xl font-medium tracking-tight tabular-nums text-fg">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </div>
  );
}
