import { useRef, useState } from 'react';
import { DAYS, DAY_FULL } from '../../data/mockData';
import { hourLabel } from '../../lib/format';

export const HM_COLORS = ['#F2F3F5', '#E3EEFF', '#C2DBFF', '#94BFFF', '#5C9DFF', '#2A7DFB', '#0062E0', '#0045A8'];
export const HM_STEPS = [0.02, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
export const HM_LEGEND = ['0%', '<15%', '15–30%', '30–45%', '45–60%', '60–75%', '75–90%', '≥90%'];

export function hmColor(v: number) {
  let i = 0;
  while (i < HM_STEPS.length && v >= HM_STEPS[i]) i++;
  return HM_COLORS[i];
}

export interface Cell {
  day: number;
  hour: number;
}

interface Props {
  matrix: number[][];
  roomCount: number;
  cellHeight?: number;
  gap?: number;
  hourEvery?: number;
  selected?: Cell | null;
  onSelect?: (c: Cell) => void;
  labelWidth?: number;
}

export function HeatmapGrid({
  matrix,
  roomCount,
  cellHeight = 18,
  gap = 3,
  hourEvery = 3,
  selected,
  onSelect,
  labelWidth = 32,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ cell: Cell; x: number; y: number } | null>(null);

  const showTip = (cell: Cell, el: HTMLElement) => {
    if (!wrap.current) return;
    const a = wrap.current.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const half = 110;
    const x = Math.min(Math.max(b.left - a.left + b.width / 2, half), a.width - half);
    setTip({ cell, x, y: b.top - a.top });
  };

  const style = {
    '--hm-h': `${cellHeight}px`,
    '--hm-gap': `${gap}px`,
    '--hm-label': `${labelWidth}px`,
  } as React.CSSProperties;

  return (
    <div ref={wrap} className="relative" style={style} onMouseLeave={() => setTip(null)}>
      <div className="hm-grid" role="grid" aria-label="Mật độ sử dụng phòng theo thứ và giờ">
        {matrix.map((row, d) => (
          <div key={d} role="row" className="contents">
            <div role="rowheader" className="flex items-center text-[12px] font-medium text-ink-2">
              {DAYS[d]}
            </div>
            {row.map((v, h) => {
              const isSel = selected?.day === d && selected?.hour === h;
              return (
                <div
                  key={h}
                  role="gridcell"
                  tabIndex={onSelect ? 0 : -1}
                  aria-label={`${DAY_FULL[d]}, ${hourLabel(h)}: ${Math.round(v * 100)}% phòng có khách`}
                  className={`hm-cell ${onSelect ? 'is-interactive' : ''} ${isSel ? 'is-selected' : ''}`}
                  style={{ background: hmColor(v) }}
                  onMouseEnter={(e) => showTip({ day: d, hour: h }, e.currentTarget)}
                  onFocus={(e) => showTip({ day: d, hour: h }, e.currentTarget)}
                  onBlur={() => setTip(null)}
                  onClick={(e) => {
                    if (!onSelect) return;
                    e.stopPropagation();
                    onSelect({ day: d, hour: h });
                  }}
                  onKeyDown={(e) => {
                    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelect({ day: d, hour: h });
                    }
                  }}
                />
              );
            })}
          </div>
        ))}
        {/* Hour axis */}
        <div />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="pt-1 text-center text-[11px] leading-none text-ink-3 tabular">
            {h % hourEvery === 0 ? `${h}h` : ''}
          </div>
        ))}
      </div>

      {tip && (
        <div className="hm-tip" style={{ left: tip.x, top: tip.y }}>
          <div className="font-semibold">
            {DAY_FULL[tip.cell.day]}, {hourLabel(tip.cell.hour)} – {hourLabel(tip.cell.hour + 1)}
          </div>
          <div className="text-white/80">
            Tỷ lệ phủ <b className="text-white">{Math.round(matrix[tip.cell.day][tip.cell.hour] * 100)}%</b>
            {' · '}TB {(matrix[tip.cell.day][tip.cell.hour] * roomCount).toFixed(1)}/{roomCount} phòng
          </div>
        </div>
      )}
    </div>
  );
}

export function HeatmapLegend({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-3">
      <span>Thấp</span>
      <div className="flex gap-[3px]">
        {HM_COLORS.map((c, i) => (
          <div key={c} className="flex flex-col items-center gap-1">
            <span className="block h-3 w-6 rounded-[3px]" style={{ background: c }} title={HM_LEGEND[i]} />
            {detailed && <span className="text-[10px] tabular">{HM_LEGEND[i]}</span>}
          </div>
        ))}
      </div>
      <span>Cao</span>
    </div>
  );
}
