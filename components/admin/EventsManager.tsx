"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveEvent, deleteEvent, type EventInput } from "@/app/admin/actions";

export type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  start_time: string | null;
  end_time: string | null;
  price: string | null;
  location: string | null;
  recurrence: "none" | "weekly" | "monthly-last";
  recurrence_dow: number | null;
  is_published: boolean;
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function recurrenceLabel(e: EventRecord): string {
  if (e.recurrence === "weekly" && e.recurrence_dow != null)
    return `Every ${DAYS[e.recurrence_dow]}`;
  if (e.recurrence === "monthly-last" && e.recurrence_dow != null)
    return `Last ${DAYS[e.recurrence_dow]} of each month`;
  return "One-time";
}

const BLANK: EventRecord = {
  id: "",
  title: "",
  description: "",
  start_date: "",
  start_time: "",
  end_time: "",
  price: "",
  location: "Christie's Golf Ranch",
  recurrence: "none",
  recurrence_dow: 5,
  is_published: true,
};

export default function EventsManager({ events }: { events: EventRecord[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<EventRecord | null>(null);
  const [adding, setAdding] = useState(false);

  function startAdd() {
    setEditing({ ...BLANK, start_date: new Date().toISOString().slice(0, 10) });
    setAdding(true);
  }

  return (
    <>
      <div className="toolbar">
        <p className="admin-lead" style={{ margin: 0 }}>
          Add, edit, or remove events. Recurring events fill in their own future dates automatically.
        </p>
        {!editing ? (
          <button className="btn-save" onClick={startAdd}>
            + Add event
          </button>
        ) : null}
      </div>

      {editing ? (
        <EventForm
          initial={editing}
          isNew={adding}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSaved={() => {
            setEditing(null);
            setAdding(false);
            router.refresh();
          }}
        />
      ) : null}

      {!editing ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>When</th>
              <th>Repeats</th>
              <th>Shown?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: "var(--ink-soft)" }}>
                  No events yet. Click “Add event” to create one.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong>{e.title}</strong>
                  </td>
                  <td>
                    {e.start_date}
                    {e.start_time ? <div style={{ color: "var(--ink-soft)" }}>{e.start_time}</div> : null}
                  </td>
                  <td>{recurrenceLabel(e)}</td>
                  <td>
                    <span className={`pill ${e.is_published ? "green" : "muted"}`}>
                      {e.is_published ? "Yes" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="linkbtn" style={{ color: "var(--brand)" }} onClick={() => setEditing(e)}>
                        Edit
                      </button>
                      <button
                        className="linkbtn"
                        onClick={async () => {
                          if (confirm(`Delete “${e.title}”?`)) {
                            await deleteEvent(e.id);
                            router.refresh();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : null}
    </>
  );
}

function EventForm({
  initial,
  isNew,
  onCancel,
  onSaved,
}: {
  initial: EventRecord;
  isNew: boolean;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState<EventRecord>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function up<K extends keyof EventRecord>(k: K, v: EventRecord[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim() || !f.start_date) {
      setErr("Please add at least a title and a date.");
      return;
    }
    setBusy(true);
    setErr("");
    const input: EventInput = {
      id: f.id || undefined,
      title: f.title,
      description: f.description || "",
      start_date: f.start_date,
      start_time: f.start_time || "",
      end_time: f.end_time || "",
      price: f.price || "",
      location: f.location || "",
      recurrence: f.recurrence,
      recurrence_dow: f.recurrence_dow,
      is_published: f.is_published,
    };
    const res = await saveEvent(input);
    setBusy(false);
    if (res.ok) onSaved();
    else setErr(res.message || "Could not save.");
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      <h2>{isNew ? "Add an event" : "Edit event"}</h2>

      <div className="fld">
        <label>Event name</label>
        <input type="text" value={f.title} onChange={(e) => up("title", e.target.value)} />
      </div>

      <div className="fld">
        <label>Description</label>
        <textarea value={f.description ?? ""} onChange={(e) => up("description", e.target.value)} />
      </div>

      <div className="fld">
        <label>How often does it happen?</label>
        <select
          value={f.recurrence}
          onChange={(e) => up("recurrence", e.target.value as EventRecord["recurrence"])}
        >
          <option value="none">One-time event</option>
          <option value="weekly">Every week</option>
          <option value="monthly-last">Last (weekday) of each month</option>
        </select>
      </div>

      {f.recurrence !== "none" ? (
        <div className="fld">
          <label>On which day of the week?</label>
          <select
            value={f.recurrence_dow ?? 5}
            onChange={(e) => up("recurrence_dow", Number(e.target.value))}
          >
            {DAYS.map((d, i) => (
              <option key={i} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="fld">
        <label>{f.recurrence === "none" ? "Date" : "Starting from (date)"}</label>
        <input type="date" value={f.start_date} onChange={(e) => up("start_date", e.target.value)} />
        {f.recurrence !== "none" ? (
          <div className="help">Future dates are filled in automatically — this is just where it begins.</div>
        ) : null}
      </div>

      <div className="fld">
        <label>Start time (optional)</label>
        <input type="text" placeholder="e.g. 8:00 AM" value={f.start_time ?? ""} onChange={(e) => up("start_time", e.target.value)} />
      </div>

      <div className="fld">
        <label>End time (optional)</label>
        <input type="text" placeholder="e.g. Dark, or 11:00 AM" value={f.end_time ?? ""} onChange={(e) => up("end_time", e.target.value)} />
      </div>

      <div className="fld">
        <label>Price (optional)</label>
        <input type="text" placeholder="e.g. $25 / golfer" value={f.price ?? ""} onChange={(e) => up("price", e.target.value)} />
      </div>

      <div className="fld">
        <label style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={f.is_published}
            onChange={(e) => up("is_published", e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
          Show this event on the website
        </label>
      </div>

      <div className="card-actions">
        <button className="btn-save" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save event"}
        </button>
        <button type="button" className="linkbtn" style={{ color: "var(--brand)" }} onClick={onCancel}>
          Cancel
        </button>
        {err ? <span className="saved-note" style={{ color: "var(--rust)" }}>{err}</span> : null}
      </div>
    </form>
  );
}
