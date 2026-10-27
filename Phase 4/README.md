# Room analytics for KiotViet (BA portfolio prototype)

A clickable prototype that extends the KiotViet F&B dashboard for room-based businesses
(music box, karaoke). Its UI follows KiotViet's visual style and all labels are in Vietnamese.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static build in dist/
```

## Screens

| Route | What it shows |
|---|---|
| `#/tong-quan` | Dashboard: existing KiotViet widgets plus two new ones, **Mật độ sử dụng phòng** (summary stats; clicking anywhere on the stats row expands the 7×24 heatmap) and **Thời gian sử dụng trung bình** (per room type). Both are tagged "Mới". |
| `#/mat-do-phong` | Heatmap drill-down, opened from "Xem chi tiết theo loại phòng" inside the expanded widget. Filters by date range and room type, with a detail panel for the selected cell. |
| `#/phong-ban` | Cashier-style room map (as in KiotViet Thu ngân) with the order panel for the selected room. Alerts appear as small badges and tile colors: Level 1 (combo ending soon) for all staff, Level 2 (abnormal duration) for managers only. |
| `#/cai-dat-thong-bao` | Notification settings: a toggle for each alert level, thresholds, who sees each alert, and app push. |

Phone screens for push notifications (lock screen, in-app list, personal toggles) are at
`/thong-bao-dien-thoai.html`, also linked from the prototype bar at the bottom left.

Use the **Quản lý / Nhân viên** switch at the bottom left (also in the account menu) to see the
screens as each role.

## Business rules in the prototype

- Occupancy and duration are measured from check-in to check-out, not from invoice creation time.
- Level 1 fires when a combo room has ≤ N minutes left (default 15, range 1–120). It can be turned off.
- Level 2 fires when a room has been open ≥ N hours (default 12, range 1–48). It overrides Level 1
  and is visible only to managers.
- Average usage time excludes sessions under 10 minutes and sessions flagged at Level 2.
- Saved thresholds update the room list, the header bell and the alert counts immediately.

## Code map

- `src/index.css`: design tokens (KiotViet blue, ink and line colors, the heatmap scale) and component classes
- `src/lib/alerts.ts`: alert evaluation (level, role, thresholds)
- `src/data/mockData.ts`: rooms, deterministic heatmap generator, duration stats
- `src/components/widgets/`: heatmap grid and widget, average time widget, SVG charts
- `src/views/`: Dashboard, HeatmapDetail, RoomList, Settings
