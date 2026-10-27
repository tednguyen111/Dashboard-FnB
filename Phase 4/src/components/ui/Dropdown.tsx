import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface DropdownProps<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  align?: 'left' | 'right';
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  align = 'right',
  icon,
  className = '',
  ariaLabel,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

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

  return (
    <div ref={ref} className={`relative inline-block ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`kv-select ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        {icon}
        <span>{current?.label}</span>
        <ChevronDown size={16} className={`text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="listbox"
          className={`kv-menu absolute top-[calc(100%+6px)] z-30 min-w-full ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              className={`kv-menu-item ${o.value === value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <span>
                {o.label}
                {o.hint && <span className="block text-xs font-normal text-ink-3">{o.hint}</span>}
              </span>
              {o.value === value ? <Check size={16} /> : <span className="w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
