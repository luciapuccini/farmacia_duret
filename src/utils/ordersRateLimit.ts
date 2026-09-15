const KEY = 'orders_submissions';

export const MAX_ORDERS_PER_DAY = 6;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getOrderCount(): number {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw) as { date: string; count: number };
    return data.date === todayKey() ? data.count : 0;
  } catch {
    return 0;
  }
}

export function recordOrder(): number {
  const next = getOrderCount() + 1;
  localStorage.setItem(KEY, JSON.stringify({ date: todayKey(), count: next }));
  return next;
}
