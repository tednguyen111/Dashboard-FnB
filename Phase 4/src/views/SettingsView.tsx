import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, Eye, Lock } from 'lucide-react';
import type { AlertSettings, Role, Room } from '../types/monitor';
import { DEFAULT_SETTINGS } from '../data/mockData';
import { allAlerts } from '../lib/alerts';
import { NumberInput, Switch } from '../components/ui/Controls';

interface Props {
  settings: AlertSettings;
  onSave: (s: AlertSettings) => void;
  rooms: Room[];
  role: Role;
  onBack: () => void;
}

type Draft = Omit<AlertSettings, 'level1Minutes' | 'level2Hours'> & {
  level1Minutes: number | '';
  level2Hours: number | '';
};

const SIDE_NAV = ['Thông tin cửa hàng', 'Mẫu in', 'Hóa đơn và thanh toán', 'Phòng/Bàn', 'Thông báo', 'Phân quyền'];

function Field({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: string }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
      <div className="pt-2 text-[14px] text-ink-2">{label}</div>
      <div>
        {children}
        {error ? (
          <p className="mt-1.5 text-[13px] text-kv-red">{error}</p>
        ) : (
          hint && <p className="mt-1.5 text-[13px] text-ink-3">{hint}</p>
        )}
      </div>
    </div>
  );
}

function Audience({ manager }: { manager?: boolean }) {
  return (
    <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-fill px-3 text-[14px]">
      {manager ? <Lock size={14} className="text-ink-3" /> : <Eye size={14} className="text-ink-3" />}
      {manager ? 'Chỉ quản lý' : 'Tất cả nhân viên'}
    </span>
  );
}

export function SettingsView({ settings, onSave, rooms, role, onBack }: Props) {
  const [draft, setDraft] = useState<Draft>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(settings), [settings]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setSaved(false);
  };

  const l1Err =
    draft.level1Enabled && (draft.level1Minutes === '' || draft.level1Minutes < 1 || draft.level1Minutes > 120 || !Number.isInteger(draft.level1Minutes))
      ? 'Nhập số phút từ 1 đến 120'
      : undefined;
  const l2Err =
    draft.level2Enabled && (draft.level2Hours === '' || draft.level2Hours < 1 || draft.level2Hours > 48 || !Number.isInteger(draft.level2Hours))
      ? 'Nhập số giờ từ 1 đến 48'
      : undefined;
  const valid = !l1Err && !l2Err;
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const preview = useMemo(() => {
    if (!valid) return null;
    const s = { ...draft, level1Minutes: Number(draft.level1Minutes) || 0, level2Hours: Number(draft.level2Hours) || 0 } as AlertSettings;
    const a = allAlerts(rooms, s, 'manager');
    return { l1: a.filter((x) => x.level === 1).length, l2: a.filter((x) => x.level === 2).length };
  }, [draft, rooms, valid]);

  const save = () => {
    if (!valid) return;
    onSave({ ...draft, level1Minutes: Number(draft.level1Minutes), level2Hours: Number(draft.level2Hours) });
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-5 lg:px-6">
      <nav className="mb-3 flex items-center gap-1 text-[13px] text-ink-2" aria-label="Breadcrumb">
        <button type="button" className="kv-link" onClick={onBack}>
          <ChevronLeft size={16} /> Quay lại
        </button>
        <span className="text-ink-3">/</span>
        <span>Thiết lập cửa hàng</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="kv-card hidden h-fit p-2 lg:block">
          {SIDE_NAV.map((s) => (
            <div
              key={s}
              className={`rounded-lg px-3 py-2 text-[14px] ${
                s === 'Thông báo' ? 'bg-kv-blue-50 font-semibold text-kv-blue' : 'text-ink-2'
              }`}
            >
              {s}
            </div>
          ))}
        </aside>

        <div className="min-w-0 max-w-[880px]">
          <h1 className="text-[20px] font-bold">Cài đặt thông báo</h1>
          <p className="mt-0.5 text-[13px] text-ink-2">
            Cảnh báo hiển thị trên màn hình Phòng/Bàn và có thể gửi tới ứng dụng quản lý trên điện thoại.
          </p>

          {role === 'staff' ? (
            <div className="kv-card mt-4 flex items-center gap-3 p-5 text-ink-2">
              <Lock size={18} className="text-ink-3" />
              Chỉ tài khoản Quản lý mới thay đổi được cài đặt thông báo.
            </div>
          ) : (
            <>
              {/* Full house */}
              <section className="kv-card mt-4">
                <header className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <h2 className="text-[16px] font-semibold">Thông báo kín phòng</h2>
                    <p className="mt-1 text-[13px] text-ink-2">
                      Gửi tới điện thoại khi tất cả {rooms.length} phòng đều có khách. Chỉ quản lý nhận.
                    </p>
                  </div>
                  <Switch label="Bật thông báo kín phòng" checked={draft.fullPush} onChange={(v) => set('fullPush', v)} />
                </header>
              </section>

              {/* Level 1 */}
              <section className="kv-card mt-4">
                <header className="flex items-start justify-between gap-4 border-b border-line-soft p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-l1-bg px-1.5 py-0.5 text-[12px] font-bold text-l1">Mức 1</span>
                      <h2 className="text-[16px] font-semibold">Combo sắp hết</h2>
                      <span className="text-[12px] text-ink-3">Không bắt buộc</span>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-2">
                      Nhắc nhân viên báo khách gia hạn hoặc chuyển sang tính giờ lẻ trước khi combo kết thúc.
                    </p>
                  </div>
                  <Switch label="Bật cảnh báo combo sắp hết" checked={draft.level1Enabled} onChange={(v) => set('level1Enabled', v)} />
                </header>
                <div className={`space-y-4 p-5 ${draft.level1Enabled ? '' : 'pointer-events-none opacity-50'}`}>
                  <Field label="Báo trước khi combo kết thúc" hint="Mặc định 15 phút. Chỉ áp dụng cho phòng đang dùng combo." error={l1Err}>
                    <NumberInput
                      label="Số phút báo trước"
                      value={draft.level1Minutes}
                      onChange={(v) => set('level1Minutes', v)}
                      unit="phút"
                      min={1}
                      max={120}
                      disabled={!draft.level1Enabled}
                      invalid={!!l1Err}
                    />
                  </Field>
                  <Field label="Ai nhìn thấy">
                    <Audience />
                  </Field>
                  <Field label="Gửi thông báo tới ứng dụng" hint="Ngoài việc hiển thị trên màn hình Phòng/Bàn">
                    <div className="pt-1.5">
                      <Switch label="Gửi thông báo Mức 1 tới ứng dụng" checked={draft.level1Push} onChange={(v) => set('level1Push', v)} />
                    </div>
                  </Field>
                </div>
              </section>

              {/* Level 2 */}
              <section className="kv-card mt-4">
                <header className="flex items-start justify-between gap-4 border-b border-line-soft p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-l2-bg px-1.5 py-0.5 text-[12px] font-bold text-l2">Mức 2</span>
                      <h2 className="text-[16px] font-semibold">Thời gian sử dụng bất thường</h2>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-2">
                      Phát hiện phòng mở quá lâu: khách đã về nhưng chưa trả phòng, hoặc hóa đơn bị bỏ quên.
                    </p>
                  </div>
                  <Switch label="Bật cảnh báo bất thường" checked={draft.level2Enabled} onChange={(v) => set('level2Enabled', v)} />
                </header>
                <div className={`space-y-4 p-5 ${draft.level2Enabled ? '' : 'pointer-events-none opacity-50'}`}>
                  <Field label="Ngưỡng thời gian sử dụng" error={l2Err}>
                    <div className="flex flex-wrap items-center gap-3">
                      <NumberInput
                        label="Số giờ"
                        value={draft.level2Hours}
                        onChange={(v) => set('level2Hours', v)}
                        unit="giờ"
                        min={1}
                        max={48}
                        disabled={!draft.level2Enabled}
                        invalid={!!l2Err}
                      />
                      {draft.level2Hours !== DEFAULT_SETTINGS.level2Hours ? (
                        <button type="button" className="kv-link text-[13px]" onClick={() => set('level2Hours', DEFAULT_SETTINGS.level2Hours)}>
                          Khôi phục mặc định (12 giờ)
                        </button>
                      ) : (
                        <span className="text-[13px] text-ink-3">Mặc định</span>
                      )}
                    </div>
                  </Field>
                  <Field label="Ai nhìn thấy">
                    <Audience manager />
                  </Field>
                  <Field label="Gửi thông báo tới ứng dụng" hint="Khuyến nghị bật để quản lý nhận được khi không ở quán">
                    <div className="pt-1.5">
                      <Switch label="Gửi thông báo Mức 2 tới ứng dụng" checked={draft.level2Push} onChange={(v) => set('level2Push', v)} />
                    </div>
                  </Field>
                </div>
              </section>

              {preview && (
                <p className="mt-4 text-[13px] text-ink-2">
                  Với cài đặt này, hiện có <b className="text-l1">{preview.l1} phòng</b> ở Mức 1 và{' '}
                  <b className="text-l2">{preview.l2} phòng</b> ở Mức 2.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {role === 'manager' && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] items-center justify-end gap-3 px-4 py-3 lg:px-6">
            {saved && !dirty && (
              <span className="mr-auto flex items-center gap-1.5 text-[13px] font-medium text-kv-green" role="status">
                <Check size={16} /> Đã lưu cài đặt
              </span>
            )}
            <button type="button" className="kv-btn kv-btn-ghost" disabled={!dirty} onClick={() => setDraft(settings)}>
              Hủy thay đổi
            </button>
            <button type="button" className="kv-btn kv-btn-primary" disabled={!dirty || !valid} onClick={save}>
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
