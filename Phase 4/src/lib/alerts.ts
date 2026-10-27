import type { AlertSettings, Role, Room, RoomAlert } from '../types/monitor';
import { durationLong } from './format';

/**
 * Evaluate the alert for a single room.
 * Level 2 (abnormal duration) wins over Level 1 and is only returned to managers.
 */
export function roomAlert(room: Room, settings: AlertSettings, role: Role): RoomAlert | null {
  if (room.elapsedMinutes === undefined) return null;
  const elapsed = room.elapsedMinutes;

  if (settings.level2Enabled && elapsed >= settings.level2Hours * 60) {
    const over = elapsed - settings.level2Hours * 60;
    return {
      roomId: room.id,
      roomName: room.name,
      level: 2,
      title: 'Bất thường',
      detail:
        over > 0
          ? `${durationLong(elapsed)} (ngưỡng ${settings.level2Hours} giờ)`
          : `Chạm ngưỡng ${settings.level2Hours} giờ`,
    };
  }

  if (settings.level1Enabled && room.combo) {
    const remaining = room.combo.durationMinutes - elapsed;
    if (remaining <= settings.level1Minutes) {
      return {
        roomId: room.id,
        roomName: room.name,
        level: 1,
        title: 'Combo sắp hết',
        detail:
          remaining > 0
            ? `${room.combo.name}, còn ${durationLong(remaining)}`
            : `${room.combo.name}, quá ${durationLong(-remaining)}`,
      };
    }
  }

  return null;
}

export function allAlerts(rooms: Room[], settings: AlertSettings, role: Role): RoomAlert[] {
  return rooms
    .map((r) => roomAlert(r, settings, role))
    .filter((a): a is RoomAlert => a !== null)
    .sort((a, b) => b.level - a.level || a.roomId - b.roomId);
}
