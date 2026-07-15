"use client";

import { useState, useTransition } from "react";
import { cancelPost, deletePost, requeuePost, sendDueNow } from "@/app/admin/actions";

export type PostRow = {
  id: string;
  body: string;
  media_url: string | null;
  channels: string[];
  email_subject: string | null;
  scheduled_at: string;
  status: "scheduled" | "sending" | "sent" | "failed" | "canceled";
  result_log: Record<string, { ok: boolean; detail: string; at: string }>;
};

const CHANNEL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  email: "Email list",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PostsQueue({ posts }: { posts: PostRow[] }) {
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();

  const upcoming = posts
    .filter((p) => p.status === "scheduled" || p.status === "sending")
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
  const past = posts.filter((p) => p.status !== "scheduled" && p.status !== "sending");

  function run(fn: () => Promise<{ ok: boolean; message: string }>) {
    startTransition(async () => {
      const res = await fn();
      setMsg(res.message);
      setTimeout(() => setMsg(""), 6000);
    });
  }

  return (
    <>
      {msg ? <div className="admin-flash">{msg}</div> : null}

      <div className="admin-card">
        <h2>Coming up</h2>
        {upcoming.length === 0 ? (
          <p className="events-empty" style={{ marginTop: 0 }}>
            Nothing scheduled. Press <strong>+ Write a post</strong> to get one ready.
          </p>
        ) : (
          upcoming.map((p) => (
            <div className="post-row" key={p.id}>
              <div className="post-when">
                {p.status === "sending" ? "Sending now…" : fmt(p.scheduled_at)}
              </div>
              <div className="post-main">
                <p className="post-body">{p.body}</p>
                <div className="post-chips">
                  {p.channels.map((ch) => (
                    <span className="pill" key={ch}>
                      {CHANNEL_LABELS[ch] ?? ch}
                    </span>
                  ))}
                  {p.media_url ? <span className="pill muted">📷 photo</span> : null}
                </div>
              </div>
              {p.status === "scheduled" ? (
                <div className="row-actions">
                  <a className="linkbtn" style={{ color: "var(--brand)" }} href={`/admin/posts/${p.id}`}>
                    Edit
                  </a>
                  <button
                    className="linkbtn"
                    disabled={pending}
                    onClick={() => run(() => cancelPost(p.id))}
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
        {upcoming.length > 0 ? (
          <div className="card-actions">
            <button className="btn-save" disabled={pending} onClick={() => run(sendDueNow)}>
              {pending ? "Working…" : "Send anything due now"}
            </button>
            <span className="help" style={{ margin: 0 }}>
              Posts also go out on their own within ~5 minutes of their time.
            </span>
          </div>
        ) : null}
      </div>

      <div className="admin-card">
        <h2>Already sent</h2>
        {past.length === 0 ? (
          <p className="events-empty" style={{ marginTop: 0 }}>
            Nothing here yet — your sent posts will show up with a report of where they went.
          </p>
        ) : (
          past.map((p) => (
            <div className="post-row" key={p.id}>
              <div className="post-when">{fmt(p.scheduled_at)}</div>
              <div className="post-main">
                <p className="post-body">{p.body}</p>
                <div className="post-chips">
                  {p.channels.map((ch) => {
                    const r = p.result_log?.[ch];
                    const cls = r?.ok ? "pill green" : p.status === "canceled" ? "pill muted" : "pill red";
                    const mark = r?.ok ? "✓" : p.status === "canceled" ? "—" : "✕";
                    return (
                      <span className={cls} key={ch} title={r?.detail ?? ""}>
                        {mark} {CHANNEL_LABELS[ch] ?? ch}
                      </span>
                    );
                  })}
                </div>
                {p.status === "failed" ? (
                  <div className="post-errors">
                    {p.channels
                      .filter((ch) => p.result_log?.[ch] && !p.result_log[ch].ok)
                      .map((ch) => (
                        <div key={ch}>
                          <strong>{CHANNEL_LABELS[ch] ?? ch}:</strong> {p.result_log[ch].detail}
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
              <div className="row-actions">
                {p.status === "failed" || p.status === "canceled" ? (
                  <>
                    <a className="linkbtn" style={{ color: "var(--brand)" }} href={`/admin/posts/${p.id}`}>
                      Edit
                    </a>
                    <button
                      className="linkbtn"
                      style={{ color: "var(--brand)" }}
                      disabled={pending}
                      onClick={() => run(() => requeuePost(p.id))}
                    >
                      Try again
                    </button>
                  </>
                ) : null}
                <button className="linkbtn" disabled={pending} onClick={() => run(() => deletePost(p.id))}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
