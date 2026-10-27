import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, CircleHelp, FileText, Settings, Store, UserRound } from 'lucide-react';
import type { NavTab, Role, RoomAlert } from '../types/monitor';

const NAV: { label: string; tab?: NavTab }[] = [
  { label: 'Tổng quan', tab: 'dashboard' },
  { label: 'Thực đơn' },
  { label: 'Kho hàng' },
  { label: 'Phòng/Bàn', tab: 'rooms' },
  { label: 'Đơn hàng' },
  { label: 'Khách hàng' },
  { label: 'Nhân viên' },
  { label: 'Số quỹ' },
  { label: 'Báo cáo' },
];

interface Props {
  tab: NavTab;
  onNavigate: (tab: NavTab) => void;
  alerts: RoomAlert[];
  role: Role;
  onRoleChange: (r: Role) => void;
  onOpenRoom: (roomId: number) => void;
}

function usePopover() {
  const [open, setOpen] = useState(false);
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
  return { open, setOpen, ref };
}

export function AppHeader({ tab, onNavigate, alerts, role, onRoleChange, onOpenRoom }: Props) {
  const bell = usePopover();
  const account = usePopover();
  const activeNav = tab === 'heatmap' ? 'dashboard' : tab;

  return (
    <header className="sticky top-0 z-40 bg-[#e6efff]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:h-[68px] md:flex-nowrap md:py-0 lg:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex shrink-0 items-center gap-2 border-0 bg-transparent p-0"
          aria-label="Về Tổng quan"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-kv-blue text-[17px] font-extrabold text-white">
            D
          </span>
          <span className="hidden text-[19px] font-bold tracking-tight text-ink sm:inline">Dashboard</span>
        </button>

        {/* Main nav */}
        <nav className="kv-nav no-scrollbar order-last flex w-full min-w-0 items-center gap-0.5 overflow-x-auto rounded-full p-1 md:order-none md:w-auto">
          {NAV.map((n) => (
            <button
              key={n.label}
              type="button"
              className={`kv-nav-item ${n.tab && n.tab === activeNav ? 'is-active' : ''}`}
              onClick={() => n.tab && onNavigate(n.tab)}
              title={n.tab ? 'Có tính năng mới' : 'Ngoài phạm vi bản mẫu'}
            >
              {n.label}
              {n.tab && <span className="new-dot" aria-label="Có tính năng mới" />}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button type="button" className="kv-outline-btn hidden xl:inline-flex">
            <Store size={16} />
            Chi nhánh trung tâm
          </button>
          <div className="hidden overflow-hidden rounded-full border border-[#b8d4ff] bg-white lg:flex">
            <button type="button" className="flex h-[32px] items-center gap-1.5 border-0 bg-transparent px-3 text-sm font-semibold text-kv-blue hover:bg-kv-blue-50">
              <FileText size={16} />
              Thu ngân
            </button>
            <span className="w-px bg-[#b8d4ff]" />
            <button type="button" aria-label="Chọn màn hình thu ngân" className="flex h-[32px] items-center border-0 bg-transparent px-2 text-kv-blue hover:bg-kv-blue-50">
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Notifications */}
          <div ref={bell.ref} className="relative">
            <button
              type="button"
              aria-label={`Thông báo (${alerts.length})`}
              className={`kv-icon-btn ${bell.open ? 'is-open' : ''}`}
              onClick={() => bell.setOpen(!bell.open)}
            >
              <Bell size={17} />
              {alerts.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-kv-red px-1 text-[10px] font-bold text-white">
                  {alerts.length}
                </span>
              )}
            </button>
            {bell.open && (
              <div className="kv-menu absolute right-0 top-[calc(100%+8px)] w-[360px] max-w-[calc(100vw-32px)] p-0">
                <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                  <span className="font-semibold">Cảnh báo phòng</span>
                  <span className="text-xs text-ink-3">{role === 'manager' ? 'Vai trò: Quản lý' : 'Vai trò: Nhân viên'}</span>
                </div>
                {alerts.length === 0 ? (
                  <div className="px-4 py-8 text-center text-ink-3">Không có cảnh báo nào</div>
                ) : (
                  <ul className="max-h-[320px] overflow-y-auto py-1">
                    {alerts.map((a) => (
                      <li key={a.roomId}>
                        <button
                          type="button"
                          className="flex w-full items-start gap-3 border-0 bg-transparent px-4 py-2.5 text-left hover:bg-fill"
                          onClick={() => {
                            bell.setOpen(false);
                            onOpenRoom(a.roomId);
                          }}
                        >
                          <span
                            className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                              a.level === 2 ? 'bg-l2-bg text-l2' : 'bg-l1-bg text-l1'
                            }`}
                          >
                            Mức {a.level}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-semibold">
                              {a.roomName}: {a.title}
                            </span>
                            <span className="block text-[13px] text-ink-2">{a.detail}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-line-soft px-4 py-2.5">
                  <button
                    type="button"
                    className="kv-link text-sm"
                    onClick={() => {
                      bell.setOpen(false);
                      onNavigate('settings');
                    }}
                  >
                    Cài đặt thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="button" aria-label="Trợ giúp" className="kv-icon-btn hidden sm:inline-flex">
            <CircleHelp size={17} />
          </button>
          <button
            type="button"
            aria-label="Cài đặt thông báo"
            className={`kv-icon-btn ${tab === 'settings' ? 'is-open' : ''}`}
            onClick={() => onNavigate('settings')}
            title="Cài đặt thông báo (tính năng mới)"
          >
            <Settings size={17} />
            <span className="new-dot on-white" aria-hidden />
          </button>

          {/* Account / role */}
          <div ref={account.ref} className="relative">
            <button
              type="button"
              aria-label="Tài khoản"
              className={`kv-icon-btn ${account.open ? 'is-open' : ''}`}
              onClick={() => account.setOpen(!account.open)}
            >
              <UserRound size={17} />
            </button>
            {account.open && (
              <div className="kv-menu absolute right-0 top-[calc(100%+8px)] w-[240px]">
                <div className="px-2.5 pb-2 pt-1.5">
                  <div className="font-semibold">Man Mát CS2</div>
                  <div className="text-[13px] text-ink-3">Xem bản mẫu với vai trò</div>
                </div>
                {(['manager', 'staff'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`kv-menu-item ${role === r ? 'is-selected' : ''}`}
                    onClick={() => {
                      onRoleChange(r);
                      account.setOpen(false);
                    }}
                  >
                    {r === 'manager' ? 'Quản lý' : 'Nhân viên thu ngân'}
                    {role === r && <span className="text-xs">Đang dùng</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
