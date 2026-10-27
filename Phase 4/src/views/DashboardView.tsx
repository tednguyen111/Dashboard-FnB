import { useState } from 'react';
import { ArrowDownRight, ArrowRight, Banknote, Bike, ChevronRight, QrCode, ShoppingCart } from 'lucide-react';
import type { DurationRange, HeatmapRange, Room } from '../types/monitor';
import { CUSTOMERS_BY_HOUR, RECENT_ACTIVITY, REVENUE_BY_HOUR } from '../data/mockData';
import { money } from '../lib/format';
import { Dropdown } from '../components/ui/Dropdown';
import { InfoTip } from '../components/ui/Controls';
import { AreaChart, BarChart } from '../components/widgets/Charts';
import { HeatmapWidget } from '../components/widgets/HeatmapWidget';
import { AvgTimeWidget } from '../components/widgets/AvgTimeWidget';
import type { Cell } from '../components/widgets/HeatmapGrid';
import type { CustomRange } from '../components/ui/DateRangeSelect';

type Day = 'yesterday' | 'today';
const DAY_OPTS = [
  { value: 'yesterday' as Day, label: 'Hôm qua' },
  { value: 'today' as Day, label: 'Hôm nay' },
];

interface Props {
  rooms: Room[];
  heatmapRange: HeatmapRange;
  heatmapCustom: CustomRange | null;
  onHeatmapRangeChange: (r: HeatmapRange, c?: CustomRange) => void;
  onOpenHeatmap: (cell?: Cell) => void;
  onOpenRooms: () => void;
}

function KpiRow({ label, value, info }: { label: string; value: string; info?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-2">{label}</span>
      <span className="flex items-center gap-1.5 tabular">
        {value}
        {info && <InfoTip>{info}</InfoTip>}
      </span>
    </div>
  );
}

export function DashboardView({ rooms, heatmapRange, heatmapCustom, onHeatmapRangeChange, onOpenHeatmap, onOpenRooms }: Props) {
  const [branch, setBranch] = useState('all');
  const [revDay, setRevDay] = useState<Day>('yesterday');
  const [cusDay, setCusDay] = useState<Day>('yesterday');
  const [durRange, setDurRange] = useState<DurationRange>('7d');
  const [durCustom, setDurCustom] = useState<CustomRange | null>(null);

  const busy = rooms.filter((r) => r.elapsedMinutes !== undefined);
  const occ = Math.round((busy.length / rooms.length) * 100);
  const openBills = busy.reduce((s, r) => s + (r.billAmount ?? 0), 0);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold">Bức tranh kinh doanh</h1>
        <Dropdown
          ariaLabel="Chi nhánh"
          value={branch}
          className="[&_.kv-select]:min-w-[200px] [&_.kv-select]:justify-between [&_.kv-select]:border-line [&_.kv-select]:bg-white"
          options={[
            { value: 'all', label: 'Tất cả chi nhánh' },
            { value: 'hq', label: 'Chi nhánh trung tâm' },
          ]}
          onChange={setBranch}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* ---------------- Main column ---------------- */}
        <div className="min-w-0 space-y-4">
          {/* KPI row (existing KiotViet) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="kv-kpi kpi-blue">
              <div className="flex items-center justify-between">
                <span className="kv-card-title">Doanh thu hôm nay</span>
                <span className="text-xs text-ink-2">Bao gồm VAT</span>
              </div>
              <div className="mt-1 text-[22px] font-bold tabular">1,443,465</div>
              <div className="flex items-center gap-1.5 text-[14px]">
                <span className="inline-flex items-center text-kv-red">
                  53% <ArrowDownRight size={15} />
                </span>
                <span className="text-ink-2">So với Hôm qua</span>
              </div>
              <div className="mt-4 space-y-2">
                <KpiRow label="Giảm giá hóa đơn" value="0" />
                <KpiRow label="Trả hàng (0)" value="0" />
              </div>
            </div>

            <div className="kv-kpi kpi-green">
              <span className="kv-card-title">Số lượng đơn hôm nay</span>
              <div className="mt-1 text-[22px] font-bold tabular">4</div>
              <div className="flex items-center gap-1.5 text-[14px]">
                <span className="inline-flex items-center text-kv-red">
                  80% <ArrowDownRight size={15} />
                </span>
                <span className="text-ink-2">So với Hôm qua</span>
              </div>
              <div className="mt-4 space-y-2">
                <KpiRow label="Trung bình đơn" value="360,866" />
                <KpiRow label="Số khách/đơn" value="1" info="Số khách trung bình trên mỗi hóa đơn" />
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenRooms}
              className="kv-kpi kpi-orange text-left transition-shadow hover:shadow-[0_4px_16px_rgba(31,35,41,0.06)]"
            >
              <div className="flex items-center justify-between">
                <span className="kv-card-title">Tỷ lệ phủ phòng</span>
                <ChevronRight size={16} className="text-ink-3" />
              </div>
              <div className="mt-1 text-[22px] font-bold tabular">{occ}%</div>
              <div className="text-[14px] text-ink-2">
                {busy.length}/{rooms.length} phòng đang sử dụng
              </div>
              <div className="mt-4 space-y-2">
                <KpiRow label={`Đơn đang phục vụ (${busy.length})`} value={money(openBills)} />
                <KpiRow label="Phòng còn trống" value={String(rooms.length - busy.length)} />
              </div>
            </button>
          </div>

          {/* Revenue + customers (existing KiotViet) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="kv-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="kv-card-title">Doanh thu thuần</h2>
                  <InfoTip>Doanh thu sau khi trừ giảm giá và trả hàng</InfoTip>
                </div>
                <Dropdown<Day> value={revDay} options={DAY_OPTS} onChange={setRevDay} ariaLabel="Ngày" />
              </div>
              <div className="mt-1 text-[20px] font-bold tabular">
                3,073,295 <span className="text-[14px] font-normal text-ink-2">(20 hóa đơn)</span>
              </div>
              <div className="kv-tabs mt-4">
                <button type="button" className="kv-tab is-active">
                  Theo giờ
                </button>
              </div>
              <div className="mt-4">
                <BarChart data={REVENUE_BY_HOUR} />
              </div>
            </section>

            <section className="kv-card p-5">
              <div className="flex items-start justify-between">
                <h2 className="kv-card-title">Lượng khách hàng</h2>
                <Dropdown<Day> value={cusDay} options={DAY_OPTS} onChange={setCusDay} ariaLabel="Ngày" />
              </div>
              <div className="mt-1 text-[20px] font-bold tabular">20 lượt khách</div>
              <div className="kv-tabs mt-4">
                <button type="button" className="kv-tab is-active">
                  Theo giờ
                </button>
              </div>
              <div className="mt-4">
                <AreaChart data={CUSTOMERS_BY_HOUR} unit="lượt khách" />
              </div>
            </section>
          </div>

          {/* NEW: Occupancy heatmap */}
          <HeatmapWidget range={heatmapRange} custom={heatmapCustom} onRangeChange={onHeatmapRangeChange} onOpenDetail={() => onOpenHeatmap()} />

          {/* NEW: Average usage time + existing cancellation widget */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AvgTimeWidget
              range={durRange}
              custom={durCustom}
              onRangeChange={(r, c) => {
                setDurRange(r);
                if (c) setDurCustom(c);
              }}
            />

            <section className="kv-card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <h2 className="kv-card-title">Tình trạng hủy món</h2>
                <Dropdown
                  value="7d"
                  options={[{ value: '7d', label: '7 ngày qua' }]}
                  onChange={() => {}}
                  ariaLabel="Khoảng thời gian"
                />
              </div>
              <dl className="mt-3 flex gap-8">
                <div>
                  <dt className="text-[13px] text-ink-2">Món bị hủy</dt>
                  <dd className="text-[20px] font-bold">1</dd>
                </div>
                <div className="border-l border-line-soft pl-8">
                  <dt className="text-[13px] text-ink-2">Hóa đơn bị hủy</dt>
                  <dd className="text-[20px] font-bold">2</dd>
                </div>
              </dl>
              <ul className="mt-4 space-y-2">
                {[
                  { label: 'Hủy sau báo bếp', color: '#F53F3F', n: 1 },
                  { label: 'Hủy sau tạm tính', color: '#FF8A00', n: 0 },
                  { label: 'Hủy khi kiểm đồ', color: '#FFC53D', n: 0 },
                ].map((r) => (
                  <li key={r.label} className="flex items-center gap-3 rounded-lg border border-line-soft px-3 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />
                    <span className="w-[130px] text-[13px] text-ink-2">{r.label}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-fill">
                      <span className="block h-full rounded-full" style={{ width: r.n ? '100%' : 0, background: r.color }} />
                    </span>
                    <span className="w-12 text-right text-[13px] font-semibold">{r.n} món</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* ---------------- Right sidebar (existing KiotViet) ---------------- */}
        <aside className="space-y-4">
          <div className="kv-card divide-y divide-line-soft overflow-hidden">
            {[
              { icon: <Bike size={18} />, bg: '#E8F5EE', fg: '#00B14F', t: 'Giao món siêu tốc', s: 'Grab, Ahamove, XanhSM' },
              { icon: <QrCode size={18} />, bg: '#EBF3FF', fg: '#0070F4', t: 'Thanh toán', s: 'Cài đặt QR ting ting miễn phí' },
              { icon: <Banknote size={18} />, bg: '#FFF4E5', fg: '#FF8A00', t: 'Vay vốn', s: 'Giải ngân tới 1 tỷ đồng chỉ trong 24H' },
            ].map((x) => (
              <button key={x.t} type="button" className="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-left hover:bg-canvas">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: x.bg, color: x.fg }}>
                  {x.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold">{x.t}</span>
                  <span className="block truncate text-[12px] text-ink-2">{x.s}</span>
                </span>
                <ChevronRight size={16} className="text-ink-3" />
              </button>
            ))}
          </div>

          <div className="kv-card p-4">
            <div className="flex items-center gap-2">
              <span className="kv-tag-new">Mới</span>
              <span className="font-semibold">Khuyến mại</span>
            </div>
            <p className="mt-1.5 text-[13px] text-ink-2">Dễ dàng tạo các loại khuyến mại phổ biến nhất</p>
            <button type="button" className="kv-link mt-2 text-[13px]">
              Xem ngay <ArrowRight size={14} />
            </button>
          </div>

          <div className="kv-card p-4">
            <h2 className="kv-card-title mb-3">Hoạt động gần đây</h2>
            <ul className="space-y-4">
              {RECENT_ACTIVITY.map((a, i) => (
                <li key={i} className="flex gap-3 text-[13px]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill text-ink-3">
                    <ShoppingCart size={15} />
                  </span>
                  <span>
                    <span className="text-kv-blue">{a.who}</span> vừa <span className="text-kv-blue">bán hàng</span> với giá
                    trị {money(a.amount)} tại Chi nhánh trung tâm
                    <span className="mt-0.5 block text-ink-3">{a.ago}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
