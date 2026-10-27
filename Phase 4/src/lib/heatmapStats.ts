import { DAYS } from '../data/mockData';
import { hourLabel } from './format';

/** Opening hours used for "average" and "quietest" (10:00 – 02:00). */
export const OPEN_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1];

export function heatmapStats(m: number[][]) {
  let sum = 0;
  let n = 0;
  let peak = { day: 0, hour: 0, v: -1 };
  let low = { day: 0, hour: 0, v: 2 };
  m.forEach((row, d) =>
    OPEN_HOURS.forEach((h) => {
      const v = row[h];
      sum += v;
      n++;
      if (v > peak.v) peak = { day: d, hour: h, v };
      if (v < low.v) low = { day: d, hour: h, v };
    }),
  );
  const dayAvg = m.map((row) => OPEN_HOURS.reduce((s, h) => s + row[h], 0) / OPEN_HOURS.length);
  const busiestDay = dayAvg.indexOf(Math.max(...dayAvg));
  return {
    avg: sum / n,
    peak,
    low,
    dayAvg,
    busiestDay,
    peakLabel: `${DAYS[peak.day]}, ${hourLabel(peak.hour)}`,
    lowLabel: `${DAYS[low.day]}, ${hourLabel(low.hour)}`,
  };
}

/** Average across all days for one hour, used for "so với TB cùng giờ". */
export function hourAverage(m: number[][], hour: number) {
  return m.reduce((s, row) => s + row[hour], 0) / m.length;
}
