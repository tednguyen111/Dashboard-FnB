import { useMemo, useState } from 'react';
import { ChevronLeft, Download } from 'lucide-react';
import type { HeatmapRange, RoomType } from '../types/monitor';
import {
  DAY_FULL,
  HEATMAP_RANGES,
  HISTORY_START,
  YESTERDAY,
  heatmapPeriod,
  ROOM_COUNT,
  ROOM_TYPE_FILTERS,
  ROOM_TYPE_LABEL,
  heatmapMatrix,
} from '../data/mockData';
import { heatmapStats, hourAverage } from '../lib/heatmapStats';
import { DAYS } from '../data/mockData';
import { hourLabel } from '../lib/format';
import { Dropdown } from '../components/ui/Dropdown';
import { DateRangeSelect, type CustomRange } from '../components/ui/DateRangeSelect';
import { HeatmapGrid, HeatmapLegend, hmColor, type Cell } from '../components/widgets/HeatmapGrid';

interface Props {
  range: HeatmapRange;
  custom: CustomRange | null;
  onRangeChange: (r: HeatmapRange, c?: CustomRange) => void;
  initialCell?: Cell | null;
  onBack: () => void;
}

const TYPES: RoomType[] = ['Couple', 'Standard', 'Big', 'VIP'];

export function HeatmapDetailView({ range, custom, onRangeChange, initialCell, onBack }: Props) {
  const [type, setType] = useState<RoomType | 'all'>('all');
  const matrix = useMemo(() => heatmapMatrix(range, type), [range, type, custom]);
  const stats = useMemo(() => heatmapStats(matrix), [matrix]);
  const [sel, setSel] = useState<Cell>(initialCell ?? { day: stats.peak.day, hour: stats.peak.hour });
  const meta = heatmapPeriod(range, custom);
  const rooms = ROOM_COUNT[type];

  const v = matrix[sel.day][sel.hour];
  const hourAvg = hourAverage(matrix, sel.hour);
  const diffPts = Math.round((v - hourAvg) * 100);

  const byType = TYPES.map((t) => ({ t, v: heatmapMatrix(range, t)[sel.day][sel.hour] }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-6">
      <nav className="mb-3 flex items-center gap-1 text-[13px] text-ink-2" aria-label="Breadcrumb">
        <button type="button" className="kv-link" onClick={onBack}>
          <ChevronLeft size={16} /> Tổng quan
        </button>
        <span className="text-ink-3">/</span>
        <span>Mật độ sử dụng phòng</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold">Mật độ sử dụng phòng</h1>
          <p className="mt-0.5 text-[13px] text-ink-2">
            {meta.period} · Trung bình {meta.weeks} tuần · Tính theo giờ nhận phòng đến giờ trả phòng
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown<RoomType | "all">
            ariaLabel="Loại phòng"
            value={type}
            options={ROOM_TYPE_FILTERS}
            onChange={setType}
            className="[&_.kv-select]:bg-white [&_.kv-select]:border-line"
          />
          <DateRangeSelect
            ariaLabel="Khoảng thời gian"
            value={range}
            presets={HEATMAP_RANGES}
            custom={custom}
            onChange={onRangeChange}
            minDate={HISTORY_START}
            maxDate={YESTERDAY}
            minDays={7}
            className="[&_.kv-select]:bg-white [&_.kv-select]:border-line"
          />
          <button type="button" className="kv-btn kv-btn-ghost h-8 px-3 text-[14px] font-medium">
            <Download size={15} /> Xuất file
          </button>
        </div>
      </div>

      {/* Summary */}
      <dl className="kv-card mb-4 grid grid-cols-2 gap-y-4 p-5 md:grid-cols-4">
        {[
          { k: 'Tỷ lệ phủ trung bình', v: `${Math.round(stats.avg * 100)}%`, s: 'Trong giờ mở cửa 10:00 – 02:00' },
          { k: 'Khung giờ cao điểm', v: stats.peakLabel, s: `${Math.round(stats.peak.v * 100)}% phòng có khách` },
          { k: 'Khung giờ vắng nhất', v: stats.lowLabel, s: `${Math.round(stats.low.v * 100)}% phòng có khách` },
          { k: 'Ngày đông khách nhất', v: DAY_FULL[stats.busiestDay], s: `TB ${Math.round(stats.dayAvg[stats.busiestDay] * 100)}% cả ngày` },
        ].map((x, i) => (
          <div key={x.k} className={i % 2 === 1 ? 'border-l border-line-soft pl-5' : i === 2 ? 'md:border-l md:border-line-soft md:pl-5' : ''}>
            <dt className="text-[13px] text-ink-2">{x.k}</dt>
            <dd className="mt-0.5 text-[20px] font-bold tabular">{x.v}</dd>
            <dd className="text-[12px] text-ink-3">{x.s}</dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="kv-card min-w-0 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="kv-card-title">
              {type === 'all' ? 'Tất cả phòng' : ROOM_TYPE_LABEL[type]} ({rooms} phòng)
            </h2>
            <span className="text-[13px] text-ink-3">Chọn một ô để xem chi tiết khung giờ</span>
          </div>
          <div className="thin-scroll -mx-1 overflow-x-auto px-1 pb-2 pt-1">
            <div className="min-w-[760px]">
              <HeatmapGrid
                matrix={matrix}
                roomCount={rooms}
                cellHeight={34}
                gap={4}
                hourEvery={1}
                labelWidth={36}
                selected={sel}
                onSelect={setSel}
              />
            </div>
          </div>
          <div className="mt-4 border-t border-line-soft pt-4">
            <HeatmapLegend detailed />
          </div>
        </section>

        {/* Selected slot */}
        <aside className="kv-card p-5" aria-live="polite">
          <div className="text-[13px] text-ink-2">Khung giờ đang chọn</div>
          <h2 className="mt-0.5 text-[16px] font-semibold">
            {DAY_FULL[sel.day]}, {hourLabel(sel.hour)} – {hourLabel(sel.hour + 1)}
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-11 w-11 shrink-0 rounded-lg" style={{ background: hmColor(v) }} />
            <div>
              <div className="text-[26px] font-bold leading-tight tabular">{Math.round(v * 100)}%</div>
              <div className="text-[13px] text-ink-2">
                Trung bình {(v * rooms).toFixed(1)}/{rooms} phòng có khách
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-canvas px-3 py-2.5 text-[13px]">
            <span className="text-ink-2">So với trung bình cùng giờ các ngày: </span>
            <span className={`font-semibold ${diffPts > 0 ? 'text-kv-green' : diffPts < 0 ? 'text-kv-red' : ''}`}>
              {diffPts > 0 ? '+' : ''}
              {diffPts}%
            </span>
          </div>

          {/* Same day profile */}
          <h3 className="mt-5 text-[13px] font-semibold">Cả ngày {DAYS[sel.day]}</h3>
          <div className="mt-2 flex h-16 items-end gap-[2px]" aria-hidden>
            {matrix[sel.day].map((x, h) => (
              <button
                key={h}
                type="button"
                tabIndex={-1}
                onClick={() => setSel({ day: sel.day, hour: h })}
                className="flex-1 rounded-t-[2px] border-0 p-0"
                style={{
                  height: `${Math.max(4, x * 100)}%`,
                  background: h === sel.hour ? '#FF8A00' : '#94BFFF',
                }}
                title={`${hourLabel(h)}: ${Math.round(x * 100)}%`}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-ink-3 tabular">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>23h</span>
          </div>

          {type === 'all' && (
            <>
              <h3 className="mt-5 text-[13px] font-semibold">Theo loại phòng</h3>
              <ul className="mt-2 space-y-2.5">
                {byType.map(({ t, v: tv }) => (
                  <li key={t} className="text-[13px]">
                    <div className="mb-1 flex justify-between">
                      <span className="text-ink-2">{ROOM_TYPE_LABEL[t]}</span>
                      <span className="font-semibold tabular">{Math.round(tv * 100)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-fill">
                      <div className="h-full rounded-full bg-kv-blue" style={{ width: `${tv * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
