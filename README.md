# Room Occupancy Analytics — CukCuk/KiotViet FnB Dashboard

> **BA/PM Portfolio Project** · Nguyễn Tuấn Đạt · Oct 2026

A full-cycle BA project built around a real operational insight gap at a music box venue in Hanoi. Covers problem discovery, user stories, process diagrams, and a working React prototype — structured to mirror how a BA-to-PM practitioner approaches a product from scratch.

---

## The Problem

KiotViet (Vietnam's leading F&B POS) tracks revenue by **invoice creation time**, not by **actual room usage time**. For time-based businesses (music box, karaoke, billiards), these two timestamps diverge significantly:

- A customer checks in at 7:00 PM, checks out at 10:00 PM
- The invoice is created at 7:00 PM and closed at 10:00 PM
- KiotViet's dashboard shows **no activity from 8–10 PM** — which is actually peak occupancy

**Result:** owners make marketing and pricing decisions based on misleading data, or rely entirely on gut feel.

---

## Solution

A new analytics module — **Room Occupancy Analytics** — added to the existing KiotViet interface, tracking actual check-in/check-out events to surface three insights the platform currently lacks:

| Feature | What it does |
|---|---|
| **Occupancy Heatmap** | 7×24 color grid showing real room usage patterns by day and hour |
| **Avg Usage Time** | Average session duration per room type, with period comparison |
| **Full Room Alert** | Push notification when all rooms are occupied; configurable alert thresholds |

---

## Project Structure

```
Phase 1 - User Stories & Problem Statement/
│   Phase 1 - Problem Statement.txt       ← Design Thinking problem definition, 2 personas, root cause
│   Phase 1 - User Stories - V0.7 (Final).txt  ← 7 US with AC, BR, MoSCoW, assumptions & open questions

Phase 2 - Diagrams/
│   fraud-alert-level 1 & 2               ← Draw.io BPMN: check-in → alert Mức 1 & 2 → checkout
│   full-room-noti                         ← Draw.io BPMN: full room push notification flow
│   app-widget-avg-heatmap                 ← Draw.io flowchart: dashboard 3-widget interaction
│   Phase 2 - Diagrams.txt                ← Diagram index + Mermaid source for detail views (1C, 1D)

Phase 3 - Old code/                        ← Deprecated, kept for reference only

Phase 4/                                   ← React + TypeScript + Tailwind v4 prototype
│   src/
│   public/
│   │   thong-bao-dien-thoai.html          ← Mobile screens: lock screen, in-app notifications, settings, occupancy view
│   │   thong-bao-dien-thoai-figma.html    ← Static version for Figma handoff reference
```

---

## Live Prototype (Phase 4)

Built with **React 19 + TypeScript + Vite + Tailwind CSS v4**. Modeled after KiotViet's actual UI patterns.

### Run locally

```bash
cd "Phase 4"
npm install
npm run dev
# → http://localhost:3000
```

### What's in the prototype

| Screen | Route | US covered |
|---|---|---|
| Dashboard — Occupancy widget | `#/tong-quan` | US-001 |
| Dashboard — Heatmap widget (expand/collapse) | `#/tong-quan` | US-002 |
| Dashboard — Avg Usage Time widget | `#/tong-quan` | US-003 |
| Heatmap detail — by room type, date range, cell drill-down | `#/mat-do-phong` | US-002 |
| Room map — cashier-style tiles, Mức 1 & Mức 2 alerts | `#/phong-ban` | US-005 |
| Notification settings — thresholds, toggles, live preview | `#/cai-dat-thong-bao` | US-006 |
| Mobile screens — lock screen, in-app list, settings, occupancy | `/thong-bao-dien-thoai.html` | US-004, US-005, US-006, US-007 |

**Role switcher** (bottom-left): toggle between Manager and Staff to see permission differences in real time.

### Known prototype limitations (by design)
- Data is static (fixed at 22:40, 27 Oct 2026) for repeatable demo
- No real-time updates (US-001 AC-2)
- No actual push notifications
- "No data" heatmap cells not demonstrated (US-002 AC-8)

---

## User Stories Summary (V0.7 Final)

| ID | Title | Priority |
|---|---|---|
| US-001 | Occupancy rate widget — real-time | Must Have |
| US-002 | Heatmap — room density by hour/day | Must Have |
| US-003 | Avg usage time widget — by room type | Must Have |
| US-004 | Full-room push notification | Should Have |
| US-005 | In-app alert flags — Mức 1 (combo) & Mức 2 (anomaly) | Should Have |
| US-006 | Notification & threshold settings | Should Have |
| US-007 | Mobile occupancy view (Persona 1 — Owner) | Should Have |

**Two user personas:**
- **Persona 1 — Owner:** views remotely on mobile a few times/week, strategic lens (pricing, promotions)
- **Persona 2 — Shift Manager:** on-site daily at the cashier station, operational lens (alerts, floor management)

---

## BA Artifacts & Skills Demonstrated

- **Problem Statement** (Design Thinking — Define stage): root cause analysis, pain points, gap analysis vs. existing software
- **User Stories** with full AC (Given/When/Then), Business Rules, MoSCoW prioritization, dependencies, open questions
- **BPMN Swimlane diagrams** (Draw.io): check-in/checkout + session monitor flow; full room notification flow
- **Flowchart diagrams**: dashboard widget interactions, heatmap detail navigation, mobile occupancy screen
- **Prototype** with role-based access control, configurable alert logic, and mobile companion screens
- **Iterative versioning**: US went through 7 drafts (V0.1–V0.7) reflecting real review cycles

---

## Tech Stack (Phase 4)

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Diagrams | Draw.io + Mermaid |

---

*This project is a BA/PM portfolio piece — it demonstrates requirements, process design, and prototype delivery, not production engineering.*
