"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePost, sendDueNow, type PostInput } from "@/app/admin/actions";
import ImageField from "./ImageField";

type Props = {
  listSize: number;
  existing?: {
    id: string;
    body: string;
    media_url: string | null;
    channels: string[];
    email_subject: string | null;
    scheduled_at: string;
  };
};

const CHANNELS = [
  { key: "facebook", label: "Facebook", desc: "Posts to the Christie's Golf Ranch page." },
  { key: "instagram", label: "Instagram", desc: "Needs a photo — Instagram posts are pictures." },
  { key: "email", label: "Email list", desc: "" }, // desc filled in with list size
];

/** Local datetime-input value for an ISO timestamp (or now + delta). */
function toLocalInput(iso?: string): string {
  const d = iso ? new Date(iso) : new Date(Date.now() + 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PostComposer({ listSize, existing }: Props) {
  const router = useRouter();
  const [body, setBody] = useState(existing?.body ?? "");
  const [mediaUrl, setMediaUrl] = useState(existing?.media_url ?? "");
  const [channels, setChannels] = useState<string[]>(existing?.channels ?? []);
  const [subject, setSubject] = useState(existing?.email_subject ?? "");
  const [timing, setTiming] = useState<"now" | "later">(existing ? "later" : "now");
  const [when, setWhen] = useState(toLocalInput(existing?.scheduled_at));
  const [previewing, setPreviewing] = useState(false);
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const wantsEmail = channels.includes("email");
  const wantsInstagram = channels.includes("instagram");

  const problems = useMemo(() => {
    const list: string[] = [];
    if (!body.trim()) list.push("Write your message first.");
    if (channels.length === 0) list.push("Pick at least one place to send it.");
    if (wantsInstagram && !mediaUrl) list.push("Instagram needs a photo — add one or un-check Instagram.");
    if (wantsEmail && !subject.trim()) list.push("Give the email a subject line.");
    if (timing === "later" && !when) list.push("Pick a day and time.");
    return list;
  }, [body, channels, mediaUrl, subject, timing, when, wantsEmail, wantsInstagram]);

  function toggle(key: string) {
    setChannels((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
    setPreviewing(false);
  }

  function submit() {
    setErr("");
    const input: PostInput = {
      id: existing?.id,
      body,
      media_url: mediaUrl,
      channels,
      email_subject: subject,
      scheduled_at: timing === "now" ? new Date().toISOString() : new Date(when).toISOString(),
    };
    startTransition(async () => {
      const res = await savePost(input);
      if (!res.ok) {
        setErr(res.message);
        return;
      }
      if (timing === "now") {
        await sendDueNow(); // fire immediately instead of waiting on the clock
      }
      router.push("/admin/posts");
      router.refresh();
    });
  }

  return (
    <>
      {!previewing ? (
        <>
          <div className="admin-card">
            <h2>1 · What do you want to say?</h2>
            <div className="fld">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"Example:\nPlay Day is this Friday — unlimited par-3 golf, $25, no tee times. Come on out!"}
                style={{ minHeight: 140 }}
              />
            </div>
            <div className="fld" style={{ marginBottom: 0 }}>
              <label>Photo (optional — but Instagram requires one)</label>
              <ImageField fieldKey={`post-${existing?.id ?? "new"}`} value={mediaUrl} onChange={setMediaUrl} />
            </div>
          </div>

          <div className="admin-card">
            <h2>2 · Where should it go?</h2>
            {CHANNELS.map((c) => (
              <label className="channel-check" key={c.key}>
                <input type="checkbox" checked={channels.includes(c.key)} onChange={() => toggle(c.key)} />
                <span>
                  <strong>{c.label}</strong>
                  <small>
                    {c.key === "email"
                      ? `Goes to the ${listSize} ${listSize === 1 ? "person" : "people"} on your list.`
                      : c.desc}
                  </small>
                </span>
              </label>
            ))}
            {wantsEmail ? (
              <div className="fld" style={{ marginTop: "1rem", marginBottom: 0 }}>
                <label>Email subject line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Play Day this Friday at the ranch"
                />
              </div>
            ) : null}
          </div>

          <div className="admin-card">
            <h2>3 · When?</h2>
            <label className="channel-check">
              <input type="radio" name="timing" checked={timing === "now"} onChange={() => setTiming("now")} />
              <span>
                <strong>Right away</strong>
                <small>Goes out as soon as you confirm.</small>
              </span>
            </label>
            <label className="channel-check">
              <input type="radio" name="timing" checked={timing === "later"} onChange={() => setTiming("later")} />
              <span>
                <strong>Pick a day &amp; time</strong>
                <small>It sends itself — you don&apos;t need to be at a computer.</small>
              </span>
            </label>
            {timing === "later" ? (
              <div className="fld" style={{ marginTop: "1rem", marginBottom: 0, maxWidth: 280 }}>
                <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
              </div>
            ) : null}
          </div>

          <div className="card-actions" style={{ marginBottom: "2rem" }}>
            <button
              className="btn-save"
              onClick={() => (problems.length ? setErr(problems[0]) : (setErr(""), setPreviewing(true)))}
            >
              Preview before sending →
            </button>
            <a className="linkbtn" href="/admin/posts" style={{ color: "var(--ink-soft)" }}>
              Never mind
            </a>
            {err ? <span className="saved-note" style={{ color: "var(--rust)" }}>{err}</span> : null}
          </div>
        </>
      ) : (
        <>
          <div className="admin-card">
            <h2>Here&apos;s how it will look</h2>
            <div className="previews">
              {channels.includes("facebook") ? (
                <div className="preview-col">
                  <div className="preview-label">Facebook</div>
                  <SocialPreview network="facebook" body={body} mediaUrl={mediaUrl} />
                </div>
              ) : null}
              {channels.includes("instagram") ? (
                <div className="preview-col">
                  <div className="preview-label">Instagram</div>
                  <SocialPreview network="instagram" body={body} mediaUrl={mediaUrl} />
                </div>
              ) : null}
              {wantsEmail ? (
                <div className="preview-col">
                  <div className="preview-label">Email · &ldquo;{subject}&rdquo;</div>
                  <EmailPreview body={body} mediaUrl={mediaUrl} />
                </div>
              ) : null}
            </div>
          </div>
          <div className="card-actions" style={{ marginBottom: "2rem" }}>
            <button className="btn-save" disabled={pending} onClick={submit}>
              {pending
                ? "Working…"
                : timing === "now"
                  ? "Looks good — send it now"
                  : "Looks good — schedule it"}
            </button>
            <button className="linkbtn" style={{ color: "var(--ink-soft)" }} onClick={() => setPreviewing(false)}>
              ← Go back and change something
            </button>
            {err ? <span className="saved-note" style={{ color: "var(--rust)" }}>{err}</span> : null}
          </div>
        </>
      )}
    </>
  );
}

function SocialPreview({
  network,
  body,
  mediaUrl,
}: {
  network: "facebook" | "instagram";
  body: string;
  mediaUrl: string;
}) {
  return (
    <div className="mock">
      <div className="mock-head">
        <span className="mock-avatar" />
        <span>
          <strong>Christie&apos;s Golf Ranch</strong>
          <small>{network === "facebook" ? "Just now · 🌎" : "christiesgolfranch"}</small>
        </span>
      </div>
      {network === "facebook" ? <p className="mock-body">{body}</p> : null}
      {mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="mock-img" src={mediaUrl} alt="" />
      ) : network === "instagram" ? (
        <div className="mock-img placeholder">photo goes here</div>
      ) : null}
      {network === "instagram" ? (
        <p className="mock-body">
          <strong>christiesgolfranch</strong> {body}
        </p>
      ) : null}
    </div>
  );
}

function EmailPreview({ body, mediaUrl }: { body: string; mediaUrl: string }) {
  return (
    <div className="mock email">
      <div className="mock-email-head">
        Christie&apos;s Golf Ranch
        <small>PILOT POINT · TEXAS</small>
      </div>
      <div className="mock-email-body">
        {mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="mock-img" src={mediaUrl} alt="" />
        ) : null}
        {body.split(/\n{2,}/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="mock-sig">— Jeff &amp; the crew at Christie&apos;s Golf Ranch</p>
      </div>
      <div className="mock-email-foot">
        920 US Highway 377, Pilot Point, TX 76258 · (214) 317-1488 · Unsubscribe
      </div>
    </div>
  );
}
