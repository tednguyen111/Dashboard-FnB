import { useEffect, useMemo, useRef, useState } from 'react';
import { BellRing, Clock3, FileText, Lock, Search, Settings2, Users, Wallet } from 'lucide-react';
import type { AlertSettings, Role, Room, RoomAlert } from '../types/monitor';
import { ROOM_TYPE_LABEL, lineTotal } from '../data/mockData';
import { roomAlert } from '../lib/alerts';
import { clockAgo, durationLong, money } from '../lib/format';

type Filter = 'all' | 'busy' | 'empty' | 'alert';
type Area = 'all' | 'f1' | 'f2';

interface Props {
  rooms: Room[];
  settings: AlertSettings;
  role: Role;
  alerts: RoomAlert[];
  focusRoomId: number | null;
  onFocusHandled: () => void;
  onOpenSettings: () => void;
}

/** "75p", "2g15p" — the compact style used on KiotViet cashier tiles. */
function tileTime(min: number) {
  if (min < 100) return `${min}p`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}g${String(m).padStart(2, '0')}p` : `${h}g`;
}

function badgeText(room: Room, alert: RoomAlert) {
  if (alert.level === 2) return 'Bất thường';
  const left = room.combo!.durationMinutes - room.elapsedMinutes!;
  return left > 0 ? `Còn ${left}p` : `Quá ${-left}p`;
}

/* ------------------------------------------------------------------ */

function RoomTile({
  room,
  alert,
  selected,
  flash,
  onClick,
}: {
  room: Room;
  alert: RoomAlert | null;
  selected: boolean;
  flash: boolean;
  onClick: () => void;
}) {
  const busy = room.elapsedMinutes !== undefined;
  const state = alert ? `is-l${alert.level}` : busy ? 'is-busy' : '';
  const iconColor = alert?.level === 2 ? 'text-l2' : alert?.level === 1 ? 'text-l1' : 'text-kv-blue';

  return (
    <button
      type="button"
      id={`room-${room.id}`}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${room.name}${busy ? ', có khách' : ', trống'}${alert ? `, ${alert.title}` : ''}`}
      className={`pos-tile ${state} ${selected ? 'is-selected' : ''} ${flash ? 'is-flash' : ''}`}
    >
      {alert && (
        <span className={`pos-badge l${alert.level}`}>
          {alert.level === 2 ? <span className="dot" /> : <Clock3 size={12} strokeWidth={2.5} />}
          {badgeText(room, alert)}
        </span>
      )}

      <span className="pos-table">
        <span className="pos-chairs top"><span /><span /></span>
        <span className="pos-chairs bottom"><span /><span /></span>
        <span className="pos-chairs left"><span /></span>
        <span className="pos-chairs right"><span /></span>
        <span className="pos-board">
          {busy && (
            <>
              <span className="flex justify-between gap-1 tabular">
                <span>{money(room.billAmount ?? 0)}</span>
                <span className={alert ? `font-semibold ${iconColor}` : ''}>{tileTime(room.elapsedMinutes!)}</span>
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-ink-2">
                <Users size={12} /> {room.guests}
              </span>
            </>
          )}
        </span>
      </span>

      <span className="flex items-center gap-1 text-[14px] font-semibold">
        {busy && <Clock3 size={15} className={iconColor} />}
        {room.name}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */

function OrderPanel({ room, alert }: { room: Room | undefined; alert: RoomAlert | null }) {
  if (!room) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-ink-3">
        Chọn một phòng để xem đơn
      </div>
    );
  }
  const busy = room.elapsedMinutes !== undefined;
  const checkIn = busy ? clockAgo(room.elapsedMinutes!) : null;

  return (
    <>
      <div className="border-b border-line-soft px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold">{room.name}</h2>
            <p className="text-[13px] text-ink-3">{ROOM_TYPE_LABEL[room.type]}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
              busy ? 'bg-kv-blue-50 text-kv-blue' : 'bg-[#E8F7EE] text-kv-green'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${busy ? 'bg-kv-blue' : 'bg-kv-green'}`} />
            {busy ? 'Có khách' : 'Trống'}
          </span>
        </div>

        {alert && (
          <div
            className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg px-3 py-2 text-[13px] ${
              alert.level === 2 ? 'bg-l2-bg text-l2' : 'bg-l1-bg text-l1'
            }`}
          >
            <span className="whitespace-nowrap font-bold">Mức {alert.level}</span>
            <span className="whitespace-nowrap font-semibold">{alert.title}</span>
            <span className="opacity-80">· {alert.detail}</span>
            {alert.level === 2 && <Lock size={12} className="ml-auto shrink-0 opacity-70" aria-label="Chỉ quản lý" />}
          </div>
        )}

        {busy && (
          <dl className="mt-3 grid grid-cols-3 gap-2 text-[13px]">
            <div>
              <dt className="text-ink-3">Giờ vào</dt>
              <dd className="font-semibold tabular">
                {checkIn!.time}
                {checkIn!.yesterday && <span className="font-normal text-ink-3"> hôm qua</span>}
              </dd>
            </div>
            <div>
              <dt className="text-ink-3">Đã dùng</dt>
              <dd
                className={`font-semibold tabular ${alert?.level === 2 ? 'text-l2' : alert?.level === 1 ? 'text-l1' : ''}`}
              >
                {durationLong(room.elapsedMinutes!)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-3">Số khách</dt>
              <dd className="font-semibold">{room.guests}</dd>
            </div>
          </dl>
        )}

        {busy && room.combo && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[12px] text-ink-2">
              <span>{room.combo.name}</span>
              <span className="tabular">
                {Math.min(room.elapsedMinutes!, room.combo.durationMinutes)}/{room.combo.durationMinutes} phút
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-fill">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (room.elapsedMinutes! / room.combo.durationMinutes) * 100)}%`,
                  background: alert?.level === 1 ? '#FA8C16' : '#0070F4',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {busy ? (
        <ul className="flex-1 divide-y divide-line-soft overflow-y-auto px-5">
          {room.items!.map((it, i) => (
            <li key={i} className="flex items-start gap-3 py-3 text-[14px]">
              <span className="w-5 shrink-0 text-ink-3 tabular">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{it.name}</span>
                <span className="text-[12px] text-ink-3 tabular">
                  {it.unit ? `${it.qty} ${it.unit}` : `x${it.qty}`} · {money(it.price)}
                </span>
              </span>
              <span className="font-semibold tabular">{money(lineTotal(it))}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 p-8 text-center">
          <span className="text-ink-2">Phòng đang trống</span>
          <span className="text-[13px] text-ink-3">Trống được {durationLong(room.emptyMinutes ?? 0)}</span>
        </div>
      )}

      <div className="border-t border-line-soft px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-ink-2">Tổng tiền</span>
          <span className="text-[18px] font-bold tabular">{money(room.billAmount ?? 0)}</span>
        </div>
        {busy ? (
          <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-2 [&_button]:text-[13px] sm:[&_button]:text-[14px]">
            <button type="button" className="kv-btn h-11 bg-kv-blue-50 px-2 text-kv-blue hover:bg-kv-blue-100">
              <BellRing size={16} className="hidden sm:block" /> Thông báo
            </button>
            <button type="button" className="kv-btn kv-btn-ghost h-11 border-kv-blue px-2 text-kv-blue">
              <FileText size={16} className="hidden sm:block" /> In tạm tính
            </button>
            <button type="button" className="kv-btn kv-btn-primary h-11 px-2">
              <Wallet size={16} className="hidden sm:block" /> Thanh toán
            </button>
          </div>
        ) : (
          <button type="button" className="kv-btn kv-btn-primary h-11 w-full">
            Nhận phòng
          </button>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

export function RoomListView({ rooms, settings, role, alerts, focusRoomId, onFocusHandled, onOpenSettings }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [area, setArea] = useState<Area>('all');
  const [selectedId, setSelectedId] = useState<number>(() => alerts[0]?.roomId ?? rooms[0].id);
  const [flash, setFlash] = useState<number | null>(null);
  const flashTimer = useRef<number | undefined>(undefined);

  const alertMap = useMemo(
    () => new Map(rooms.map((r) => [r.id, roomAlert(r, settings, role)])),
    [rooms, settings, role],
  );

  const busyCount = rooms.filter((r) => r.elapsedMinutes !== undefined).length;
  const l1 = alerts.filter((a) => a.level === 1).length;
  const l2 = alerts.filter((a) => a.level === 2).length;

  const visible = rooms.filter((r) => {
    if (area === 'f1' && r.id > 5) return false;
    if (area === 'f2' && r.id <= 5) return false;
    if (filter === 'busy') return r.elapsedMinutes !== undefined;
    if (filter === 'empty') return r.elapsedMinutes === undefined;
    if (filter === 'alert') return !!alertMap.get(r.id);
    return true;
  });

  const goTo = (id: number) => {
    setFilter('all');
    setArea('all');
    setSelectedId(id);
    requestAnimationFrame(() => {
      document.getElementById(`room-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFlash(id);
      window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => setFlash(null), 1300);
    });
  };

  useEffect(() => {
    if (focusRoomId !== null) {
      goTo(focusRoomId);
      onFocusHandled();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRoomId]);

  const selected = rooms.find((r) => r.id === selectedId);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-4 lg:px-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        {/* ---------------- Room map ---------------- */}
        <section className="kv-card flex min-h-[560px] flex-col p-4" aria-label="Sơ đồ phòng">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5">
              {(
                [
                  ['all', 'Tất cả'],
                  ['f1', 'Tầng 1'],
                  ['f2', 'Tầng 2'],
                ] as [Area, string][]
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setArea(k)}
                  className={`h-8 rounded-full border-0 px-3.5 text-[14px] font-medium ${
                    area === k ? 'bg-[#0062E0] text-white' : 'bg-fill text-ink-2 hover:bg-[#e8eaee]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button type="button" aria-label="Tìm phòng" className="flex h-8 w-8 items-center justify-center rounded-full border-0 bg-fill text-ink-2 hover:bg-[#e8eaee]">
                <Search size={16} />
              </button>
              {role === 'manager' && (
                <button
                  type="button"
                  aria-label="Cài đặt cảnh báo"
                  title="Cài đặt cảnh báo"
                  onClick={onOpenSettings}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-0 bg-fill text-ink-2 hover:bg-[#e8eaee]"
                >
                  <Settings2 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap gap-x-5 gap-y-2" role="radiogroup" aria-label="Lọc phòng">
              {(
                [
                  ['all', `Tất cả (${rooms.length})`],
                  ['busy', `Sử dụng (${busyCount})`],
                  ['empty', `Còn trống (${rooms.length - busyCount})`],
                ] as [Filter, string][]
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={filter === k}
                  className={`kv-radio ${filter === k ? 'is-active' : ''}`}
                  onClick={() => setFilter(k)}
                >
                  {l}
                </button>
              ))}
            </div>

            {alerts.length > 0 && (
              <button
                type="button"
                onClick={() => setFilter(filter === 'alert' ? 'all' : 'alert')}
                aria-pressed={filter === 'alert'}
                className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[13px] font-semibold ${
                  filter === 'alert' ? 'border-kv-orange bg-l1-bg' : 'border-l1-line bg-white hover:bg-l1-bg'
                }`}
              >
                <BellRing size={14} className="text-l1" />
                {l2 > 0 && (
                  <span className="inline-flex items-center gap-1 text-l2">
                    <span className="h-2 w-2 rounded-full bg-l2" /> {l2} bất thường
                  </span>
                )}
                {l1 > 0 && l2 > 0 && <span className="text-line">|</span>}
                {l1 > 0 && (
                  <span className="inline-flex items-center gap-1 text-l1">
                    <span className="h-2 w-2 rounded-full bg-[#E07B00]" /> {l1} sắp hết combo
                  </span>
                )}
              </button>
            )}
          </div>

          {role === 'staff' && (
            <p className="mt-2 flex items-center gap-1.5 text-[12px] text-ink-3">
              <Lock size={12} /> Cảnh báo Mức 2 chỉ hiển thị với Quản lý.
            </p>
          )}

          {visible.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-ink-3">Không có phòng nào</div>
          ) : (
            <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(152px,1fr))] content-start gap-2">
              {visible.map((r) => (
                <RoomTile
                  key={r.id}
                  room={r}
                  alert={alertMap.get(r.id) ?? null}
                  selected={r.id === selectedId}
                  flash={flash === r.id}
                  onClick={() => setSelectedId(r.id)}
                />
              ))}
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft pt-3 text-[12px] text-ink-3" style={{ marginTop: 'auto' }}>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] border border-[#A9B8CC] bg-white" /> Trống
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] bg-[#CFE4FF]" /> Có khách
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] bg-[#FFE7C2]" /> Sắp hết combo
            </span>
            {role === 'manager' && (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-[3px] bg-[#FFDCDC]" /> Bất thường
              </span>
            )}
          </div>
        </section>

        {/* ---------------- Order panel ---------------- */}
        <section
          className="kv-card flex flex-col overflow-hidden lg:sticky lg:min-h-[560px] lg:top-[84px]"
          aria-label="Đơn của phòng"
          aria-live="polite"
        >
          <OrderPanel room={selected} alert={selected ? alertMap.get(selected.id) ?? null : null} />
        </section>
      </div>
    </div>
  );
}
