import { addDays, startOfDay } from "@/lib/dates";
import type { ListId, Task } from "@/lib/store";

export type DayBucket = {
  ts: number;
  completed: number;
  created: number;
};

export function lastNDays(tasks: Task[], n: number, now = Date.now()): DayBucket[] {
  const today = startOfDay(now);
  const buckets: DayBucket[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const ts = addDays(-i, today);
    const next = ts + 86_400_000;
    let completed = 0;
    let created = 0;
    for (const t of tasks) {
      if (t.completed && t.completedAt && t.completedAt >= ts && t.completedAt < next) {
        completed += 1;
      }
      if (t.createdAt >= ts && t.createdAt < next) created += 1;
    }
    buckets.push({ ts, completed, created });
  }
  return buckets;
}

export function todayStats(tasks: Task[], now = Date.now()) {
  const start = startOfDay(now);
  const end = start + 86_400_000;
  const completedToday = tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt >= start && t.completedAt < end,
  );
  const createdToday = tasks.filter((t) => t.createdAt >= start && t.createdAt < end);
  const remaining = tasks.filter((t) => !t.completed);
  return {
    completedToday,
    createdTodayCount: createdToday.length,
    remainingCount: remaining.length,
    completedCount: completedToday.length,
  };
}

export function completionStreak(tasks: Task[], now = Date.now()) {
  const today = startOfDay(now);
  const daysWithWork = new Set<number>();
  for (const t of tasks) {
    if (t.completed && t.completedAt) daysWithWork.add(startOfDay(t.completedAt));
  }
  let streak = 0;
  let cursor = daysWithWork.has(today) ? today : addDays(-1, today);
  while (daysWithWork.has(cursor)) {
    streak += 1;
    cursor = addDays(-1, cursor);
  }
  return streak;
}

export function listBreakdown(tasks: Task[]) {
  const ids: ListId[] = ["inbox", "personal", "work"];
  return ids.map((id) => {
    const inList = tasks.filter((t) => t.listId === id);
    return {
      id,
      total: inList.length,
      completed: inList.filter((t) => t.completed).length,
      active: inList.filter((t) => !t.completed).length,
    };
  });
}

export function bestDay(days: DayBucket[]) {
  if (days.length === 0) return null;
  return days.reduce((best, d) => (d.completed > best.completed ? d : best), days[0]);
}
