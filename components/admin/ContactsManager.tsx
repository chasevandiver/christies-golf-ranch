"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteContact, setUnsubscribed } from "@/app/admin/actions";

export type Contact = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string;
  consent: boolean;
  unsubscribed: boolean;
  created_at: string;
};

function toCsv(rows: Contact[]): string {
  const head = ["Name", "Email", "Phone", "Source", "Consent", "Unsubscribed", "Signed up"];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.name ?? "",
      r.email,
      r.phone ?? "",
      r.source,
      r.consent ? "yes" : "no",
      r.unsubscribed ? "yes" : "no",
      new Date(r.created_at).toLocaleDateString(),
    ]
      .map((v) => esc(String(v)))
      .join(",")
  );
  return [head.map(esc).join(","), ...lines].join("\n");
}

export default function ContactsManager({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return contacts;
    return contacts.filter(
      (c) =>
        c.email.toLowerCase().includes(s) ||
        (c.name ?? "").toLowerCase().includes(s) ||
        (c.phone ?? "").includes(s)
    );
  }, [q, contacts]);

  function download() {
    const blob = new Blob([toCsv(contacts)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `christies-email-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 340, padding: ".7rem 1rem", borderRadius: 8, border: "1.5px solid var(--line-l)", fontSize: "1rem" }}
        />
        <button className="btn-save" onClick={download} disabled={contacts.length === 0}>
          Download list (CSV)
        </button>
      </div>

      <p className="admin-lead">
        {contacts.length} {contacts.length === 1 ? "person has" : "people have"} signed up.
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Signed up</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ color: "var(--ink-soft)" }}>
                {contacts.length === 0 ? "No sign-ups yet." : "No matches."}
              </td>
            </tr>
          ) : (
            filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.name || "—"}</td>
                <td>{c.email}</td>
                <td>{c.phone || "—"}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>
                  {c.unsubscribed ? (
                    <span className="pill muted">Unsubscribed</span>
                  ) : (
                    <span className="pill green">Subscribed</span>
                  )}
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="linkbtn"
                      style={{ color: "var(--leather)" }}
                      onClick={async () => {
                        await setUnsubscribed(c.id, !c.unsubscribed);
                        router.refresh();
                      }}
                    >
                      {c.unsubscribed ? "Re-subscribe" : "Unsubscribe"}
                    </button>
                    <button
                      className="linkbtn"
                      onClick={async () => {
                        if (confirm(`Remove ${c.email}?`)) {
                          await deleteContact(c.id);
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
    </>
  );
}
