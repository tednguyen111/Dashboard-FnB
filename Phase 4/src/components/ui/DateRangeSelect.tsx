import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronDown } from 'lucide-react';

export interface CustomRange {
  from: string; // yyyy-mm-dd
  to: string;
}

interface Preset<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T | 'custom';
  presets: Preset<T>[];
  custom: CustomRange | null;
  onChange: (value: T | 'custom', custom?: CustomRange) => void;
  /** Oldest selectable date (yyyy-mm-dd). */
  minDate: string;
  maxDate: string;
  /** Minimum span in days, e.g. 7 so every weekday is covered. */
  minDays?: number;
  className?: string;
  ariaLabel?: string;
}

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
const fmtShort = (iso: string) => fmtDate(iso).slice(0, 5);
export const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1;

export function DateRangeSelect<T extends string>({
  value,
  presets,
  custom,
  onChange,
  minDate,
  maxDate,
  minDays = 1,
  className = '',
  ariaLabel,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [from, setFrom] = useState(custom?.from ?? '');
  const [to, setTo] = useState(custom?.to ?? maxDate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const label =
    value === 'custom' && custom
      ? `${fmtShort(custom.from)} – ${fmtShort(custom.to)}`
      : presets.find((p) => p.value === value)?.label;

  let error = '';
  if (from && to) {
    if (from > to) error = 'Ngày bắt đầu phải trước ngày kết thúc';
    else if (from < minDate || to > maxDate) error = `Chỉ chọn trong khoảng ${fmtDate(minDate)} – ${fmtDate(maxDate)}`;
    else if (daysBetween(from, to) < minDays) error = `Chọn ít nhất ${minDays} ngày`;
  }
  const canApply = !!from && !!to && !error;

  return (
    <div ref={ref} className={`relative inline-block ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`kv-select ${open ? 'is-open' : ''}`}
        onClick={() => {
          setOpen((o) => !o);
          setEditing(value === 'custom');
        }}
      >
        {value === 'custom' && <CalendarDays size={15} className="text-ink-3" />}
        <span className="tabular">{label}</span>
        <ChevronDown size={16} className={`text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="kv-menu absolute right-0 top-[calc(100%+6px)] z-30 w-[248px]">
          {presets.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`kv-menu-item ${p.value === value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange(p.value);
                setOpen(false);
              }}
            >
              {p.label}
              {p.value === value ? <Check size={16} /> : <span className="w-4" />}
            </button>
          ))}
          <div className="my-1 h-px bg-line-soft" />
          <button
            type="button"
            className={`kv-menu-item ${value === 'custom' ? 'is-selected' : ''}`}
            onClick={() => setEditing((e) => !e)}
            aria-expanded={editing}
          >
            <span className="flex items-center gap-2">
              <CalendarDays size={15} /> Tùy chọn
            </span>
            <ChevronDown size={15} className={`text-ink-3 transition-transform ${editing ? 'rotate-180' : ''}`} />
          </button>

          {editing && (
            <div className="space-y-2 px-2.5 pb-2 pt-1">
              <label className="block text-[12px] text-ink-2">
                Từ ngày
                <input
                  type="date"
                  value={from}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setFrom(e.target.value)}
                  className="mt-1 block h-9 w-full rounded-lg border border-line px-2.5 text-[14px] text-ink outline-none focus:border-kv-blue"
                />
              </label>
              <label className="block text-[12px] text-ink-2">
                Đến ngày
                <input
                  type="date"
                  value={to}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setTo(e.target.value)}
                  className="mt-1 block h-9 w-full rounded-lg border border-line px-2.5 text-[14px] text-ink outline-none focus:border-kv-blue"
                />
              </label>
              {error ? (
                <p className="text-[12px] text-kv-red">{error}</p>
              ) : (
                from && to && <p className="text-[12px] text-ink-3">{daysBetween(from, to)} ngày</p>
              )}
              <button
                type="button"
                disabled={!canApply}
                className="kv-btn kv-btn-primary h-8 w-full text-[13px]"
                onClick={() => {
                  onChange('custom', { from, to });
                  setOpen(false);
                }}
              >
                Áp dụng
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
