import { useLayoutEffect, useRef, useState } from 'react';

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

interface Point {
  label: string;
  value: number;
}

const PAD = { top: 10, right: 20, bottom: 26, left: 44 };

function niceTicks(max: number, count: number) {
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
}

function Axes({
  ticks,
  w,
  h,
  y,
  fmt,
}: {
  ticks: number[];
  w: number;
  h: number;
  y: (v: number) => number;
  fmt: (v: number) => string;
}) {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={w - PAD.right} y1={y(t)} y2={y(t)} stroke="#F0F1F4" />
          <text x={PAD.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill="#86909C">
            {fmt(t)}
          </text>
        </g>
      ))}
      <line x1={PAD.left} x2={w - PAD.right} y1={h - PAD.bottom} y2={h - PAD.bottom} stroke="#E5E6EB" />
    </g>
  );
}

export function BarChart({ data, height = 240, unit = 'N' }: { data: Point[]; height?: number; unit?: string }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const ticks = niceTicks(Math.max(...data.map((d) => d.value)), 6);
  const max = ticks[ticks.length - 1];
  const innerW = Math.max(0, w - PAD.left - PAD.right);
  const band = innerW / data.length;
  const barW = Math.min(20, band * 0.5);
  const y = (v: number) => PAD.top + (1 - v / max) * (height - PAD.top - PAD.bottom);

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {w > 0 && (
        <svg width={w} height={height} role="img" aria-label="Biểu đồ doanh thu theo giờ">
          <Axes ticks={ticks} w={w} h={height} y={y} fmt={(t) => (t === 0 ? '0' : `${t} ${unit}`)} />
          {data.map((d, i) => {
            const cx = PAD.left + band * i + band / 2;
            const top = y(d.value);
            const hgt = Math.max(2, height - PAD.bottom - top);
            return (
              <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <rect x={cx - band / 2} y={PAD.top} width={band} height={height - PAD.top - PAD.bottom} fill="transparent" />
                <rect
                  x={cx - barW / 2}
                  y={height - PAD.bottom - hgt}
                  width={barW}
                  height={hgt}
                  rx={3}
                  fill={hover === i ? '#005FD1' : '#0070F4'}
                />
                {(band >= 38 || i % 2 === 0) && (
                  <text x={cx} y={height - 8} textAnchor="middle" fontSize="11" fill="#86909C">
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && w > 0 && (
        <div
          className="hm-tip"
          style={{ left: PAD.left + band * hover + band / 2, top: y(data[hover].value) }}
        >
          <div className="font-semibold">{data[hover].label}</div>
          <div>
            {data[hover].value} {unit === 'N' ? 'nghìn đồng' : unit}
          </div>
        </div>
      )}
    </div>
  );
}

/** Monotone cubic interpolation: smooth, never overshoots below 0. */
function monotonePath(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return '';
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i]);
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

export function AreaChart({ data, height = 240, unit }: { data: Point[]; height?: number; unit: string }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const ticks = niceTicks(Math.max(...data.map((d) => d.value)), 4);
  const max = ticks[ticks.length - 1];
  const innerW = Math.max(0, w - PAD.left - PAD.right);
  const step = innerW / (data.length - 1);
  const y = (v: number) => PAD.top + (1 - v / max) * (height - PAD.top - PAD.bottom);
  const pts = data.map((d, i) => [PAD.left + step * i, y(d.value)] as [number, number]);
  const line = monotonePath(pts);
  const area = `${line} L${pts[pts.length - 1][0]},${height - PAD.bottom} L${pts[0][0]},${height - PAD.bottom} Z`;

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {w > 0 && (
        <svg width={w} height={height} role="img" aria-label="Biểu đồ lượng khách theo giờ">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0070F4" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0070F4" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <Axes ticks={ticks} w={w} h={height} y={y} fmt={String} />
          <path d={area} fill="url(#areaFill)" />
          <path d={line} fill="none" stroke="#0070F4" strokeWidth={2} />
          {data.map((d, i) => (
            <g key={d.label}>
              <rect
                x={pts[i][0] - step / 2}
                y={PAD.top}
                width={step}
                height={height - PAD.top - PAD.bottom}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              {(step >= 38 || i % 2 === 0) && (
                <text
                  x={pts[i][0]}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#86909C"
                >
                  {d.label}
                </text>
              )}
            </g>
          ))}
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={pts[hover][0]} x2={pts[hover][0]} y1={PAD.top} y2={height - PAD.bottom} stroke="#C9CDD4" strokeDasharray="3 3" />
              <circle cx={pts[hover][0]} cy={pts[hover][1]} r={4.5} fill="#fff" stroke="#0070F4" strokeWidth={2} />
            </g>
          )}
        </svg>
      )}
      {hover !== null && w > 0 && (
        <div className="hm-tip" style={{ left: pts[hover][0], top: pts[hover][1] }}>
          <div className="font-semibold">{data[hover].label}</div>
          <div>
            {data[hover].value} {unit}
          </div>
        </div>
      )}
    </div>
  );
}
