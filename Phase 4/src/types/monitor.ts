export type NavTab = 'dashboard' | 'heatmap' | 'rooms' | 'settings';

export type Role = 'manager' | 'staff';

export type RoomType = 'Couple' | 'Standard' | 'Big' | 'VIP';

export interface Combo {
  name: string;
  durationMinutes: number;
}

export interface OrderItem {
  name: string;
  qty: number;
  unit?: string;
  price: number;
}

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  /** Minutes since check-in. Undefined = room is empty. */
  elapsedMinutes?: number;
  /** Minutes since the room became empty (only for empty rooms). */
  emptyMinutes?: number;
  combo?: Combo;
  /** Running bill amount, VND (derived from items). */
  billAmount?: number;
  guests?: number;
  items?: OrderItem[];
}

export type AlertLevel = 1 | 2;

export interface RoomAlert {
  roomId: number;
  roomName: string;
  level: AlertLevel;
  title: string;
  detail: string;
}

export interface AlertSettings {
  level1Enabled: boolean;
  /** Warn this many minutes before a combo ends. */
  level1Minutes: number;
  level1Push: boolean;
  level2Enabled: boolean;
  /** Abnormal duration threshold in hours. */
  level2Hours: number;
  level2Push: boolean;
  /** Push to managers when every room is occupied. */
  fullPush: boolean;
}

export type HeatmapRange = '7d' | '4w' | 'this-month' | 'last-month' | '3m' | 'custom';
export type DurationRange = 'today' | 'yesterday' | '7d' | '30d' | 'this-month' | 'custom';
