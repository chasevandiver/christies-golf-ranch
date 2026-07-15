import { signOutAction } from "@/app/admin/actions";

const TABS = [
  { href: "/admin", key: "content", label: "Website Text & Photos" },
  { href: "/admin/events", key: "events", label: "Events Calendar" },
  { href: "/admin/contacts", key: "contacts", label: "Email List" },
];

export default function AdminShell({
  active,
  children,
}: {
  active: "content" | "events" | "contacts";
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="admin-top">
        <div className="wrap">
          <a className="admin-brand" href="/admin">
            Christie&apos;s Golf Ranch
            <small>Owner Dashboard</small>
          </a>
          <nav className="admin-nav">
            {TABS.map((t) => (
              <a key={t.key} href={t.href} className={active === t.key ? "active" : ""}>
                {t.label}
              </a>
            ))}
            <a href="/" target="_blank" rel="noopener" style={{ color: "var(--accent-bright)" }}>
              View Site ↗
            </a>
            <form action={signOutAction}>
              <button className="admin-signout" type="submit">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </div>
      <main className="admin-main">{children}</main>
    </>
  );
}
