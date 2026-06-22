const STORAGE_KEY = 'orders_submissions';
const MAX_PER_DAY = 6;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function isFormLimited(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { date: string; count: number };
    const isToday = data.date === todayKey();
    if (!isToday) {
      // clean old data
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), count: 1 }));
      return false;
    }

    if (data.count >= MAX_PER_DAY) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function setFormSubmittions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const { count } = JSON.parse(raw) as { date: string; count: number };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), count: count + 1 }));
  }
}
