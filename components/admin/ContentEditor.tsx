"use client";

import { useState } from "react";
import { saveContent } from "@/app/admin/actions";
import ImageField from "./ImageField";

export type Block = {
  key: string;
  section: string;
  label: string;
  help: string | null;
  type: "text" | "textarea" | "image" | "url";
  value: string | null;
};

export default function ContentEditor({ sections }: { sections: [string, Block[]][] }) {
  return (
    <>
      {sections.map(([name, blocks]) => (
        <SectionCard key={name} name={name} blocks={blocks} />
      ))}
    </>
  );
}

function SectionCard({ name, blocks }: { name: string; blocks: Block[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(blocks.map((b) => [b.key, b.value ?? ""]))
  );
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  function set(key: string, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setSaved(false);
  }

  async function onSave() {
    setBusy(true);
    setErr("");
    const updates = blocks.map((b) => ({ key: b.key, value: values[b.key] ?? "" }));
    const res = await saveContent(updates);
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } else {
      setErr(res.message || "Could not save.");
    }
  }

  return (
    <div className="admin-card">
      <h2>{name}</h2>
      {blocks.map((b) => (
        <div className="fld" key={b.key}>
          <label htmlFor={b.key}>{b.label}</label>
          {b.help ? <div className="help">{b.help}</div> : null}
          {b.type === "textarea" ? (
            <textarea id={b.key} value={values[b.key]} onChange={(e) => set(b.key, e.target.value)} />
          ) : b.type === "image" ? (
            <ImageField fieldKey={b.key} value={values[b.key]} onChange={(url) => set(b.key, url)} />
          ) : (
            <input
              id={b.key}
              type={b.type === "url" ? "url" : "text"}
              value={values[b.key]}
              onChange={(e) => set(b.key, e.target.value)}
            />
          )}
        </div>
      ))}
      <div className="card-actions">
        <button className="btn-save" onClick={onSave} disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
        {saved ? <span className="saved-note">✓ Saved</span> : null}
        {err ? <span className="saved-note" style={{ color: "var(--rust)" }}>{err}</span> : null}
      </div>
    </div>
  );
}
