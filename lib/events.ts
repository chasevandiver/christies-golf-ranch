import { createClient } from "@/lib/supabase/server";

export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  start_date: string; // 'YYYY-MM-DD'
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  price: string | null;
  recurrence: "none" | "weekly" | "monthly-last";
  recurrence_dow: number | null; // 0=Sun .. 6=Sat
  is_published: boolean;
  sort: number;
}

export interface Occurrence {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  price: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Parse 'YYYY-MM-DD' as a local-midnight Date (no timezone drift). */
function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/** Last given weekday (dow) of a specific year/month. */
function lastWeekdayOfMonth(year: number, month: number, dow: number): Date {
  const last = new Date(year, month + 1, 0); // last day of month
  const diff = (last.getDay() - dow + 7) % 7;
  return new Date(year, month, last.getDate() - diff);
}

/**
 * Expand events (including recurring ones) into concrete upcoming occurrences,
 * sorted soonest-first. This is what makes the calendar "auto-populate."
 */
export function expandEvents(rows: EventRow[], monthsAhead = 6): Occurrence[] {
  const today = startOfToday();
  const horizon = new Date(today.getFullYear(), today.getMonth() + monthsAhead, today.getDate());
  const out: Occurrence[] = [];

  const push = (row: EventRow, date: Date) =>
    out.push({
      id: row.id,
      title: row.title,
      description: row.description,
      date,
      start_time: row.start_time,
      end_time: row.end_time,
      location: row.location,
      price: row.price,
    });

  for (const row of rows) {
    if (!row.is_published) continue;
    const anchor = parseDate(row.start_date);

    if (row.recurrence === "none") {
      if (anchor >= today && anchor <= horizon) push(row, anchor);
      continue;
    }

    if (row.recurrence === "weekly" && row.recurrence_dow != null) {
      // first occurrence on/after the later of today and the anchor date
      let cur = anchor > today ? new Date(anchor) : new Date(today);
      const shift = (row.recurrence_dow - cur.getDay() + 7) % 7;
      cur = new Date(cur.getTime() + shift * DAY_MS);
      while (cur <= horizon) {
        push(row, new Date(cur));
        cur = new Date(cur.getTime() + 7 * DAY_MS);
      }
      continue;
    }

    if (row.recurrence === "monthly-last" && row.recurrence_dow != null) {
      const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
      while (cursor <= horizon) {
        const occ = lastWeekdayOfMonth(cursor.getFullYear(), cursor.getMonth(), row.recurrence_dow);
        if (occ >= today && occ <= horizon) push(row, occ);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      continue;
    }
  }

  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Fetch published events and return upcoming occurrences for the public site. */
export async function getUpcomingEvents(limit = 8): Promise<Occurrence[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("sort");
  return expandEvents((data ?? []) as EventRow[]).slice(0, limit);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatOccurrence(date: Date) {
  return {
    weekday: WEEKDAYS[date.getDay()],
    month: MONTHS[date.getMonth()],
    day: date.getDate(),
  };
}
