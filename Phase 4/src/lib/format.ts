/** "2 giờ 15 phút" style, used in detail text. */
export function durationLong(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r} phút`;
  if (r === 0) return `${h} giờ`;
  return `${h} giờ ${r} phút`;
}

/** "2g 15p" compact style, used in charts and tight spaces. */
export function durationShort(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r}p`;
  return `${h}g ${String(r).padStart(2, '0')}p`;
}

export function money(v: number): string {
  return v.toLocaleString('en-US');
}

export function hourLabel(h: number): string {
  return `${String(h % 24).padStart(2, '0')}:00`;
}

/** Fixed "now" for the prototype so screenshots are reproducible. */
export const DEMO_NOW = { hour: 22, minute: 40, dateLabel: '27/10/2026' };

export function clockAgo(minutesAgo: number): { time: string; yesterday: boolean } {
  const nowMin = DEMO_NOW.hour * 60 + DEMO_NOW.minute;
  let t = nowMin - minutesAgo;
  let yesterday = false;
  while (t < 0) {
    t += 1440;
    yesterday = true;
  }
  const h = Math.floor(t / 60);
  const m = t % 60;
  return { time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, yesterday };
}
