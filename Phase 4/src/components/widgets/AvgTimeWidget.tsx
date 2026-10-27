import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { DurationRange } from '../../types/monitor';
import { DURATION_DATA, DURATION_RANGES, HISTORY_START, LOW_DATA_SESSIONS, ROOM_TYPE_LABEL, TODAY } from '../../data/mockData';
import { durationLong, durationShort } from '../../lib/format';
import { DateRangeSelect, type CustomRange } from '../ui/DateRangeSelect';
import { InfoTip } from '../ui/Controls';

function Delta({ diff, compare }: { diff: number; compare?: string }) {
  if (diff === 0) return <span className="text-ink-3">Không đổi{compare ? ` so với ${compare}` : ''}</span>;
  const up = diff > 0;
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-flex items-center font-medium ${up ? 'text-kv-green' : 'text-kv-red'}`}>
        {up ? '+' : '−'}
        {durationLong(Math.abs(diff))}
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </span>
      {compare && <span className="text-ink-2">So với {compare}</span>}
    </span>
  );
}

export function AvgTimeWidget({
  range,
  custom,
  onRangeChange,
}: {
  range: DurationRange;
  custom: CustomRange | null;
  onRangeChange: (r: DurationRange, c?: CustomRange) => void;
}) {
  const rows = DURATION_DATA[range];
  const meta = DURATION_RANGES.find((r) => r.value === range) ?? { compare: 'khoảng trước đó' };
  const sessions = rows.reduce((s, r) => s + r.sessions, 0);
  const avg = rows.reduce((s, r) => s + r.avgMinutes * r.sessions, 0) / sessions;
  const prevRows = rows.filter((r) => r.prevAvgMinutes > 0);
  const prevAvg =
    prevRows.reduce((s, r) => s + r.prevAvgMinutes * r.sessions, 0) / prevRows.reduce((s, r) => s + r.sessions, 0);

  const scaleMax = Math.ceil(Math.max(...rows.map((r) => r.avgMinutes)) / 60) * 60;
  const ticks = Array.from({ length: scaleMax / 60 + 1 }, (_, i) => i * 60);
  const pct = (m: number) => `${(m / scaleMax) * 100}%`;

  return (
    <section className="kv-card flex flex-col p-5" aria-label="Thời gian sử dụng trung bình">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="kv-card-title">Thời gian sử dụng trung bình</h2>
          <span className="kv-tag-new">Mới</span>
          <InfoTip width={300}>
            Thời lượng trung bình mỗi lượt, từ lúc nhận phòng đến lúc trả phòng. Không tính lượt dưới 10 phút và lượt
            bị cảnh báo bất thường (Mức 2).
          </InfoTip>
        </div>
        <DateRangeSelect
          ariaLabel="Khoảng thời gian"
          value={range}
          presets={DURATION_RANGES}
          custom={custom}
          onChange={onRangeChange}
          minDate={HISTORY_START}
          maxDate={TODAY}
        />
      </div>

      <div className="mt-3">
        <div className="text-[22px] font-bold tabular">{durationLong(avg)}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
          <Delta diff={Math.round(avg - prevAvg)} compare={meta.compare} />
          <span className="text-ink-3">· {sessions.toLocaleString('en-US')} lượt sử dụng</span>
        </div>
      </div>

      <div className="mt-5 flex-1">
        <div className="mb-2 grid grid-cols-[120px_1fr_64px] items-center gap-3 text-[12px] text-ink-3 sm:grid-cols-[150px_1fr_72px]">
          <span>Loại phòng</span>
          <span className="relative h-3">
            {ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 tabular" style={{ left: pct(t) }}>
                {t / 60}g
              </span>
            ))}
          </span>
          <span className="text-right">TB / lượt</span>
        </div>

        <ul className="space-y-1">
          {rows.map((r) => (
            <li
              key={r.type}
              className="group grid grid-cols-[120px_1fr_64px] items-center gap-3 rounded-lg py-2 sm:grid-cols-[150px_1fr_72px]"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{ROOM_TYPE_LABEL[r.type]}</span>
                <span className="flex items-center gap-1.5 text-[12px] text-ink-3">
                  {r.sessions.toLocaleString('en-US')} lượt
                  {r.sessions < LOW_DATA_SESSIONS && (
                    <span
                      className="rounded bg-l1-bg px-1 text-[11px] font-medium text-l1"
                      title={`Dưới ${LOW_DATA_SESSIONS} lượt, chưa đủ để kết luận`}
                    >
                      Ít dữ liệu
                    </span>
                  )}
                </span>
              </span>
              <span className="relative h-5">
                {ticks.slice(1).map((t) => (
                  <span key={t} className="absolute inset-y-[-6px] w-px bg-line-soft" style={{ left: pct(t) }} />
                ))}
                <span
                  className="absolute inset-y-0 left-0 rounded-r-[4px] bg-kv-blue transition-[width] duration-300 group-hover:bg-kv-blue-hover"
                  style={{ width: pct(r.avgMinutes) }}
                />
                <span
                  className="absolute inset-y-[-4px] w-0 border-l-[1.5px] border-dashed border-kv-orange"
                  style={{ left: pct(avg) }}
                  aria-hidden
                />
              </span>
              <span className="text-right font-semibold tabular">{durationShort(r.avgMinutes)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-line-soft pt-3 text-[12px] text-ink-3">
        <span className="inline-block h-3 w-0 border-l-[1.5px] border-dashed border-kv-orange" />
        Trung bình toàn quán ({durationShort(avg)})
      </div>
    </section>
  );
}
