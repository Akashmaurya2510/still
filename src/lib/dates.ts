export function startOfDay(ts = Date.now()) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function addDays(days: number, from = Date.now()) {
  return startOfDay(from) + days * 86_400_000;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function formatDue(dueAt: number | null | undefined) {
  if (!dueAt) return null;
  const today = startOfDay();
  const day = startOfDay(dueAt);
  const diff = Math.round((day - today) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < -1) return `${Math.abs(diff)}d overdue`;
  return new Date(dueAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(dueAt: number | null | undefined, completed: boolean) {
  if (!dueAt || completed) return false;
  return startOfDay(dueAt) < startOfDay();
}
