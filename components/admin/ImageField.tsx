"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ImageField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setErr("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${fieldKey.replace(/[^a-z0-9]+/gi, "-")}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("site-images")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch {
      setErr("Upload failed. Please try a different photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="imgfld">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="preview" src={value} alt="" />
      ) : (
        <div className="preview empty">No photo yet</div>
      )}
      <div className="controls">
        <label className="uploadbtn">
          {busy ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
        {value ? (
          <button type="button" className="removebtn" onClick={() => onChange("")}>
            Remove photo
          </button>
        ) : null}
        {err ? <span className="uploading" style={{ color: "var(--rust)" }}>{err}</span> : null}
      </div>
    </div>
  );
}
