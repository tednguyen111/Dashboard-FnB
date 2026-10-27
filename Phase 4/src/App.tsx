import { useEffect, useMemo, useState } from 'react';
import type { AlertSettings, HeatmapRange, NavTab, Role } from './types/monitor';
import { DEFAULT_SETTINGS, ROOMS } from './data/mockData';
import { allAlerts } from './lib/alerts';
import { AppHeader } from './components/AppHeader';
import type { Cell } from './components/widgets/HeatmapGrid';
import type { CustomRange } from './components/ui/DateRangeSelect';
import { DashboardView } from './views/DashboardView';
import { HeatmapDetailView } from './views/HeatmapDetailView';
import { RoomListView } from './views/RoomListView';
import { SettingsView } from './views/SettingsView';

const ROUTES: Record<NavTab, string> = {
  dashboard: '#/tong-quan',
  heatmap: '#/mat-do-phong',
  rooms: '#/phong-ban',
  settings: '#/cai-dat-thong-bao',
};

function tabFromHash(): NavTab {
  const h = window.location.hash;
  return (Object.keys(ROUTES) as NavTab[]).find((k) => ROUTES[k] === h) ?? 'dashboard';
}

export default function App() {
  const [tab, setTab] = useState<NavTab>(tabFromHash);
  const [role, setRole] = useState<Role>('manager');
  const [settings, setSettings] = useState<AlertSettings>(DEFAULT_SETTINGS);
  const [heatmapRange, setHeatmapRange] = useState<HeatmapRange>('4w');
  const [heatmapCustom, setHeatmapCustom] = useState<CustomRange | null>(null);
  const [heatmapCell, setHeatmapCell] = useState<Cell | null>(null);
  const changeHeatmapRange = (r: HeatmapRange, c?: CustomRange) => {
    setHeatmapRange(r);
    if (c) setHeatmapCustom(c);
  };
  const [focusRoomId, setFocusRoomId] = useState<number | null>(null);

  const alerts = useMemo(() => allAlerts(ROOMS, settings, role), [settings, role]);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (t: NavTab) => {
    if (window.location.hash !== ROUTES[t]) window.location.hash = ROUTES[t];
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        tab={tab}
        onNavigate={navigate}
        alerts={alerts}
        role={role}
        onRoleChange={setRole}
        onOpenRoom={(id) => {
          navigate('rooms');
          setFocusRoomId(id);
        }}
      />

      <main className="kv-page">
        {tab === 'dashboard' && (
          <DashboardView
            rooms={ROOMS}
            heatmapRange={heatmapRange}
            heatmapCustom={heatmapCustom}
            onHeatmapRangeChange={changeHeatmapRange}
            onOpenHeatmap={(cell) => {
              setHeatmapCell(cell ?? null);
              navigate('heatmap');
            }}
            onOpenRooms={() => navigate('rooms')}
          />
        )}
        {tab === 'heatmap' && (
          <HeatmapDetailView
            key={`${heatmapCell?.day}-${heatmapCell?.hour}`}
            range={heatmapRange}
            custom={heatmapCustom}
            onRangeChange={changeHeatmapRange}
            initialCell={heatmapCell}
            onBack={() => navigate('dashboard')}
          />
        )}
        {tab === 'rooms' && (
          <RoomListView
            rooms={ROOMS}
            settings={settings}
            role={role}
            alerts={alerts}
            focusRoomId={focusRoomId}
            onFocusHandled={() => setFocusRoomId(null)}
            onOpenSettings={() => navigate('settings')}
          />
        )}
        {tab === 'settings' && (
          <SettingsView settings={settings} onSave={setSettings} rooms={ROOMS} role={role} onBack={() => navigate('rooms')} />
        )}
      </main>

      {/* Prototype role switch, so reviewers can see what each role sees */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-3.5 pr-1 text-[13px] shadow-[0_6px_20px_rgba(31,35,41,0.12)]">
        <span className="hidden text-ink-3 sm:inline">Bản mẫu · Xem với vai trò</span>
        <div className="kv-seg !rounded-full !p-0.5">
          {(['manager', 'staff'] as Role[]).map((r) => (
            <button key={r} type="button" className={`!h-7 !rounded-full !text-[13px] ${role === r ? 'is-active' : ''}`} onClick={() => setRole(r)}>
              {r === 'manager' ? 'Quản lý' : 'Nhân viên'}
            </button>
          ))}
        </div>
        <a
          href="./thong-bao-dien-thoai.html"
          target="_blank"
          rel="noopener"
          className="mr-2 hidden whitespace-nowrap text-kv-blue hover:underline sm:inline"
        >
          Xem trên điện thoại
        </a>
      </div>
    </div>
  );
}
