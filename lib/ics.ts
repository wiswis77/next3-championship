import type { ActionItem } from "./schema";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIcsDate(isoDay: string): string {
  return isoDay.replaceAll("-", "");
}

export function buildIcs(action: ActionItem): string {
  if (!action.due) {
    throw new Error("due required");
  }
  const stamp = new Date();
  const dtstamp = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`;
  const day = toIcsDate(action.due);
  const uid = `${day}-${Math.random().toString(36).slice(2, 10)}@next3`;
  const summary = action.title.replace(/[,;\\]/g, " ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Next3//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${day}`,
    `SUMMARY:${summary}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${summary}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function downloadIcs(action: ActionItem): void {
  const ics = buildIcs(action);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `next3-${action.due}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
