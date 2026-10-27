import { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { HeatmapRange } from '../../types/monitor';
import { HEATMAP_RANGES, ROOM_COUNT, HISTORY_START, YESTERDAY, heatmapMatrix, heatmapPeriod } from '../../data/mockData';
import { heatmapStats } from '../../lib/heatmapStats';
import { DateRangeSelect, type CustomRange } from '../ui/DateRangeSelect';
import { InfoTip } from '../ui/Controls';
import { HeatmapGrid, HeatmapLegend } from './HeatmapGrid';

interface Props {
  range: HeatmapRange;
  custom: CustomRange | null;
  onRangeChange: (r: HeatmapRange, c?: CustomRange) => void;
  /** Opens the full drill-down page. */
  onOpenDetail: () => void;
}

export function HeatmapWidget({ range, custom, onRangeChange, onOpenDetail }: Props) {
  const [open, setOpen] = useState(false);
  const matrix = useMemo(() => heatmapMatrix(range), [range, custom]);
  const stats = useMemo(() => heatmapStats(matrix), [matrix]);
  const meta = heatmapPeriod(range, custom);

  return (
    <section className="kv-card" aria-label="Mật độ sử dụng phòng">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="kv-card-title">Mật độ sử dụng phòng</h2>
            <span className="kv-tag-new">Mới</span>
            <InfoTip width={280}>
              Tỷ lệ phòng có khách theo thứ và khung giờ. Tính từ lúc nhận phòng đến lúc trả phòng, không theo giờ tạo
              hóa đơn.
            </InfoTip>
          </div>
          <p className="mt-1 text-[13px] text-ink-3">{meta.period}</p>
        </div>
        <DateRangeSelect
          ariaLabel="Khoảng thời gian"
          value={range}
          presets={HEATMAP_RANGES}
          custom={custom}
          onChange={onRangeChange}
          minDate={HISTORY_START}
          maxDate={YESTERDAY}
          minDays={7}
        />
      </div>

      {/* The whole summary row toggles the heatmap */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="occupancy-heatmap"
        onClick={() => setOpen((o) => !o)}
        className="group mx-2 mt-3 block w-[calc(100%-16px)] rounded-[10px] border-0 bg-transparent px-3 py-3 text-left transition-colors hover:bg-canvas"
      >
        <span className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4">
          <span>
            <span className="block text-[13px] text-ink-2">Tỷ lệ phủ trung bình</span>
            <span className="mt-0.5 block text-xl font-bold tabular">{Math.round(stats.avg * 100)}%</span>
          </span>
          <span className="border-l border-line-soft pl-4">
            <span className="block text-[13px] text-ink-2">Khung giờ cao điểm</span>
            <span className="mt-0.5 block text-xl font-bold tabular">{stats.peakLabel}</span>
          </span>
          <span className="border-l border-line-soft pl-4">
            <span className="block text-[13px] text-ink-2">Khung giờ vắng nhất</span>
            <span className="mt-0.5 block text-xl font-bold tabular">{stats.lowLabel}</span>
          </span>
          <span className="flex items-center gap-1 text-[13px] font-medium text-kv-blue">
            <span className="hidden sm:inline">{open ? 'Thu gọn' : 'Xem heatmap'}</span>
            <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </span>
        </span>
      </button>

      {open && (
        <div id="occupancy-heatmap" className="px-5 pb-5">
          <div className="thin-scroll -mx-1 mt-3 overflow-x-auto px-1 pb-1 pt-1">
            <div className="min-w-[560px]">
              <HeatmapGrid matrix={matrix} roomCount={ROOM_COUNT.all} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3">
            <HeatmapLegend />
            <button type="button" className="kv-link text-[13px]" onClick={onOpenDetail}>
              Xem chi tiết theo loại phòng <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
      {!open && <div className="h-2" />}
    </section>
  );
}
