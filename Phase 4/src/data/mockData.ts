import type { DurationRange, HeatmapRange, Room, RoomType, AlertSettings } from '../types/monitor';

/* ------------------------------------------------------------------ */
/* Rooms (live state at 22:40, 27/10/2026)                              */
/* ------------------------------------------------------------------ */

const H_COUPLE = 80000;
const H_STD = 60000;

export const ROOMS: Room[] = [
  {
    id: 1, name: 'Phòng 01', type: 'Couple', elapsedMinutes: 135, guests: 2,
    items: [
      { name: 'Giờ thu âm Couple', qty: 2.25, unit: 'giờ', price: H_COUPLE },
      { name: 'Trà đào cam sả', qty: 2, price: 30000 },
    ],
  },
  {
    id: 2, name: 'Phòng 02', type: 'Couple', elapsedMinutes: 170, guests: 2,
    combo: { name: 'Combo 3 giờ', durationMinutes: 180 },
    items: [{ name: 'Combo 3 giờ Couple', qty: 1, price: 299000 }],
  },
  {
    id: 3, name: 'Phòng 03', type: 'Standard', elapsedMinutes: 75, guests: 3,
    items: [
      { name: 'Giờ thu âm Standard', qty: 1.25, unit: 'giờ', price: H_STD },
      { name: 'Nước suối', qty: 2, price: 15000 },
      { name: 'Snack khoai tây', qty: 1, price: 30000 },
    ],
  },
  {
    id: 4, name: 'Phòng 04', type: 'Big', elapsedMinutes: 410, guests: 6,
    combo: { name: 'Combo Đêm 7 giờ', durationMinutes: 420 },
    items: [
      { name: 'Combo Đêm 7 giờ Big', qty: 1, price: 549000 },
      { name: 'Bia Tiger', qty: 4, price: 25000 },
    ],
  },
  {
    id: 5, name: 'Phòng 05', type: 'Standard', elapsedMinutes: 45, guests: 2,
    items: [
      { name: 'Giờ thu âm Standard', qty: 0.75, unit: 'giờ', price: H_STD },
      { name: 'Trà sữa trân châu', qty: 1, price: 45000 },
    ],
  },
  {
    id: 6, name: 'Phòng 06', type: 'Couple', elapsedMinutes: 760, guests: 2,
    items: [
      { name: 'Giờ thu âm Couple', qty: 12.67, unit: 'giờ', price: H_COUPLE },
      { name: 'Mì ly', qty: 2, price: 25000 },
      { name: 'Trà đào cam sả', qty: 4, price: 30000 },
    ],
  },
  {
    id: 7, name: 'Phòng 07', type: 'Big', elapsedMinutes: 120, guests: 5,
    combo: { name: 'Combo 4 giờ', durationMinutes: 240 },
    items: [{ name: 'Combo 4 giờ Big', qty: 1, price: 459000 }],
  },
  {
    id: 8, name: 'Phòng 08', type: 'Standard', elapsedMinutes: 15, guests: 1,
    items: [
      { name: 'Giờ thu âm Standard', qty: 0.25, unit: 'giờ', price: H_STD },
      { name: 'Nước suối', qty: 1, price: 15000 },
    ],
  },
  { id: 9, name: 'Phòng 09', type: 'Couple', emptyMinutes: 195 },
  { id: 10, name: 'Phòng 10', type: 'VIP', emptyMinutes: 40 },
];

export const lineTotal = (i: { qty: number; price: number }) => Math.round((i.qty * i.price) / 1000) * 1000;
ROOMS.forEach((r) => {
  if (r.items) r.billAmount = r.items.reduce((s, i) => s + lineTotal(i), 0);
});

export const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  Couple: 'Phòng Couple',
  Standard: 'Phòng Standard',
  Big: 'Phòng Big (4–6 người)',
  VIP: 'Phòng VIP',
};

export const DEFAULT_SETTINGS: AlertSettings = {
  level1Enabled: true,
  level1Minutes: 15,
  level1Push: true,
  level2Enabled: true,
  level2Hours: 12,
  level2Push: true,
  fullPush: true,
};

/** Prototype calendar: today is 27/10/2026, history is kept for 90 days. */
export const TODAY = '2026-10-27';
export const YESTERDAY = '2026-10-26';
export const HISTORY_START = '2026-07-29';

/* ------------------------------------------------------------------ */
/* Heatmap                                                              */
/* ------------------------------------------------------------------ */

export const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
export const DAY_FULL = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

export const HEATMAP_RANGES: { value: Exclude<HeatmapRange, 'custom'>; label: string; period: string; weeks: number }[] = [
  { value: '7d', label: '7 ngày qua', period: '20/10 – 26/10/2026', weeks: 1 },
  { value: '4w', label: '4 tuần qua', period: '29/09 – 26/10/2026', weeks: 4 },
  { value: 'this-month', label: 'Tháng này', period: '01/10 – 26/10/2026', weeks: 4 },
  { value: 'last-month', label: 'Tháng trước', period: '01/09 – 30/09/2026', weeks: 4 },
  { value: '3m', label: '3 tháng qua', period: '28/07 – 26/10/2026', weeks: 13 },
];

export const ROOM_TYPE_FILTERS: { value: RoomType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả loại phòng' },
  { value: 'Couple', label: 'Phòng Couple' },
  { value: 'Standard', label: 'Phòng Standard' },
  { value: 'Big', label: 'Phòng Big' },
  { value: 'VIP', label: 'Phòng VIP' },
];

/** N per room type, derived from the room list (never hard-coded). */
export const ROOM_COUNT: Record<RoomType | 'all', number> = {
  all: ROOMS.length,
  Couple: ROOMS.filter((r) => r.type === 'Couple').length,
  Standard: ROOMS.filter((r) => r.type === 'Standard').length,
  Big: ROOMS.filter((r) => r.type === 'Big').length,
  VIP: ROOMS.filter((r) => r.type === 'VIP').length,
};

// Typical music box / karaoke curve: dead in the morning, builds through the afternoon,
// peaks 19:00–22:00, tails off after midnight.
const HOUR_PROFILE = [
  0.42, 0.28, 0.14, 0.05, 0.01, 0, 0, 0, 0.02, 0.07, 0.14, 0.2, 0.24, 0.26, 0.3, 0.33, 0.38, 0.46,
  0.6, 0.76, 0.86, 0.84, 0.72, 0.58,
];
const DAY_FACTOR = [0.72, 0.7, 0.78, 0.86, 1.0, 1.12, 1.02];
const RANGE_SEED: Record<HeatmapRange, number> = { '7d': 11, '4w': 7, 'this-month': 5, 'last-month': 3, '3m': 2, custom: 13 };
const RANGE_NOISE: Record<HeatmapRange, number> = { '7d': 0.16, '4w': 0.08, 'this-month': 0.09, 'last-month': 0.09, '3m': 0.04, custom: 0.1 };
const TYPE_FACTOR: Record<RoomType | 'all', number> = { all: 1, Couple: 1.06, Standard: 0.92, Big: 1.0, VIP: 0.7 };

function hash(a: number, b: number, c: number): number {
  let x = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  x = (x ^ (x >>> 13)) * 1274126177;
  x = x ^ (x >>> 16);
  return ((x >>> 0) % 10000) / 10000;
}

/** Occupancy ratio 0..1 for a given weekday (0 = T2) and hour. */
export function occupancy(day: number, hour: number, range: HeatmapRange, type: RoomType | 'all' = 'all'): number {
  // Hours 00–02 belong to the previous evening's crowd.
  const factorDay = hour <= 2 ? (day + 6) % 7 : day;
  let v = HOUR_PROFILE[hour] * DAY_FACTOR[factorDay];

  // Weekend daytime is busier (students, families).
  if ((day === 5 || day === 6) && hour >= 10 && hour <= 17) v += 0.16;
  // Big rooms skew to weekends and groups.
  if (type === 'Big' && (day >= 4 || hour >= 19)) v *= 1.12;
  if (type === 'Couple' && hour >= 20) v *= 1.06;

  v *= TYPE_FACTOR[type];
  if (HOUR_PROFILE[hour] > 0) {
    v += (hash(day, hour, RANGE_SEED[range] + type.length) - 0.5) * 2 * RANGE_NOISE[range];
  }
  return Math.min(1, Math.max(0, v));
}

export function heatmapMatrix(range: HeatmapRange, type: RoomType | 'all' = 'all'): number[][] {
  return DAYS.map((_, d) => Array.from({ length: 24 }, (_, h) => occupancy(d, h, range, type)));
}

/* ------------------------------------------------------------------ */
/* Average usage time                                                   */
/* ------------------------------------------------------------------ */

export const DURATION_RANGES: { value: Exclude<DurationRange, 'custom'>; label: string; compare: string }[] = [
  { value: 'today', label: 'Hôm nay', compare: 'hôm qua' },
  { value: 'yesterday', label: 'Hôm qua', compare: 'hôm kia' },
  { value: '7d', label: '7 ngày qua', compare: '7 ngày trước' },
  { value: '30d', label: '30 ngày qua', compare: '30 ngày trước' },
  { value: 'this-month', label: 'Tháng này', compare: 'tháng trước' },
];

export interface DurationStat {
  type: RoomType;
  avgMinutes: number;
  prevAvgMinutes: number;
  sessions: number;
}

export const DURATION_DATA: Record<DurationRange, DurationStat[]> = {
  today: [
    { type: 'Couple', avgMinutes: 128, prevAvgMinutes: 141, sessions: 9 },
    { type: 'Standard', avgMinutes: 96, prevAvgMinutes: 104, sessions: 11 },
    { type: 'Big', avgMinutes: 205, prevAvgMinutes: 182, sessions: 4 },
    { type: 'VIP', avgMinutes: 240, prevAvgMinutes: 230, sessions: 1 },
  ],
  yesterday: [
    { type: 'Couple', avgMinutes: 141, prevAvgMinutes: 135, sessions: 12 },
    { type: 'Standard', avgMinutes: 104, prevAvgMinutes: 110, sessions: 14 },
    { type: 'Big', avgMinutes: 182, prevAvgMinutes: 176, sessions: 6 },
    { type: 'VIP', avgMinutes: 230, prevAvgMinutes: 0, sessions: 2 },
  ],
  '7d': [
    { type: 'Couple', avgMinutes: 138, prevAvgMinutes: 131, sessions: 84 },
    { type: 'Standard', avgMinutes: 102, prevAvgMinutes: 106, sessions: 97 },
    { type: 'Big', avgMinutes: 188, prevAvgMinutes: 171, sessions: 41 },
    { type: 'VIP', avgMinutes: 236, prevAvgMinutes: 241, sessions: 12 },
  ],
  '30d': [
    { type: 'Couple', avgMinutes: 134, prevAvgMinutes: 129, sessions: 352 },
    { type: 'Standard', avgMinutes: 105, prevAvgMinutes: 101, sessions: 410 },
    { type: 'Big', avgMinutes: 179, prevAvgMinutes: 174, sessions: 168 },
    { type: 'VIP', avgMinutes: 244, prevAvgMinutes: 232, sessions: 47 },
  ],
  'this-month': [
    { type: 'Couple', avgMinutes: 136, prevAvgMinutes: 128, sessions: 318 },
    { type: 'Standard', avgMinutes: 104, prevAvgMinutes: 103, sessions: 371 },
    { type: 'Big', avgMinutes: 181, prevAvgMinutes: 169, sessions: 152 },
    { type: 'VIP', avgMinutes: 241, prevAvgMinutes: 236, sessions: 43 },
  ],
  custom: [
    { type: 'Couple', avgMinutes: 132, prevAvgMinutes: 130, sessions: 141 },
    { type: 'Standard', avgMinutes: 101, prevAvgMinutes: 104, sessions: 166 },
    { type: 'Big', avgMinutes: 176, prevAvgMinutes: 172, sessions: 63 },
    { type: 'VIP', avgMinutes: 238, prevAvgMinutes: 240, sessions: 4 },
  ],
};

/** Fewer sessions than this and the average is flagged as unreliable. */
export const LOW_DATA_SESSIONS = 5;

/* ------------------------------------------------------------------ */
/* Existing KiotViet dashboard content                                  */
/* ------------------------------------------------------------------ */

export const REVENUE_BY_HOUR = [
  { label: '00:00', value: 410 },
  { label: '01:00', value: 165 },
  { label: '02:00', value: 600 },
  { label: '05:00', value: 690 },
  { label: '06:00', value: 430 },
  { label: '13:00', value: 12 },
  { label: '16:00', value: 10 },
  { label: '18:00', value: 18 },
  { label: '20:00', value: 28 },
  { label: '21:00', value: 485 },
  { label: '22:00', value: 225 },
];

export const CUSTOMERS_BY_HOUR = [
  { label: '00:00', value: 2 },
  { label: '01:00', value: 1 },
  { label: '02:00', value: 3 },
  { label: '05:00', value: 2 },
  { label: '06:00', value: 1 },
  { label: '13:00', value: 1 },
  { label: '16:00', value: 1 },
  { label: '18:00', value: 1 },
  { label: '20:00', value: 2 },
  { label: '21:00', value: 2 },
  { label: '22:00', value: 4 },
];

export const RECENT_ACTIVITY = [
  { who: 'Man Mát CS2', amount: 497465, ago: '4 giờ trước' },
  { who: 'Man Mát CS2', amount: 322000, ago: '4 giờ trước' },
  { who: 'Man Mát CS2', amount: 279000, ago: '4 giờ trước' },
  { who: 'Man Mát CS2', amount: 345000, ago: '7 giờ trước' },
  { who: 'Man Mát CS2', amount: 147000, ago: '11 giờ trước' },
];

/* ------------------------------------------------------------------ */
/* Range labels incl. custom                                            */
/* ------------------------------------------------------------------ */
const fmt = (iso: string) => iso.split('-').reverse().join('/');

export function heatmapPeriod(range: HeatmapRange, custom: { from: string; to: string } | null) {
  if (range === 'custom' && custom) {
    const days =
      Math.round((new Date(custom.to).getTime() - new Date(custom.from).getTime()) / 86400000) + 1;
    return { period: `${fmt(custom.from)} – ${fmt(custom.to)}`, weeks: Math.max(1, Math.round(days / 7)) };
  }
  const r = HEATMAP_RANGES.find((x) => x.value === range) ?? HEATMAP_RANGES[1];
  return { period: r.period, weeks: r.weeks };
}
