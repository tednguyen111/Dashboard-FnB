import { useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="kv-switch"
      onClick={() => onChange(!checked)}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  unit,
  min,
  max,
  disabled,
  invalid,
  label,
}: {
  value: number | '';
  onChange: (v: number | '') => void;
  unit: string;
  min: number;
  max: number;
  disabled?: boolean;
  invalid?: boolean;
  label: string;
}) {
  return (
    <label className={`kv-input ${disabled ? 'is-disabled' : ''} ${invalid ? 'is-invalid' : ''}`}>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      />
      <span>{unit}</span>
    </label>
  );
}

/** Small "i" icon with a hover/focus tooltip, as on KiotViet card titles. */
export function InfoTip({ children, width = 260 }: { children: ReactNode; width?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" aria-label="Giải thích" className="text-ink-3 hover:text-ink-2 border-0 bg-transparent p-0 inline-flex">
        <Info size={15} />
      </button>
      {open && (
        <span
          role="tooltip"
          style={{ width }}
          className="absolute left-1/2 top-[calc(100%+8px)] z-40 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-[13px] font-normal leading-relaxed text-white shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
