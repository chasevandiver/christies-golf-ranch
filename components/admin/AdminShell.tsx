import { signOutAction } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

/**
 * Admin chrome: slim top bar + left sidebar. The sidebar lists the fixed
 * tools first, then one link per website section so each opens on its own
 * page instead of one giant form.
 */
export default async function AdminShell({
  active,
  children,
}: {
  active: string; // "home" | "posts" | "events" | "contacts" | a section slug
  children: React.ReactNode;
}) {
  let sections: string[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("content_blocks")
      .select("section,sort")
      .order("sort");
    const seen = new Set<string>();
    for (const row of data ?? []) {
      if (!seen.has(row.section)) {
        seen.add(row.section);
        sections.push(row.section);
      }
    }
    sections = sections.sort((a, b) => a.localeCompare(b));
  } catch {
    // Sidebar still renders its fixed links if the backend is unreachable.
  }

  const tools = [
    { href: "/admin", key: "home", label: "Home" },
    { href: "/admin/posts", key: "posts", label: "Social & Email Posts" },
    { href: "/admin/events", key: "events", label: "Events Calendar" },
    { href: "/admin/contacts", key: "contacts", label: "Email List" },
  ];

  return (
    <>
      <div className="admin-top">
        <div className="wrap">
          <a className="admin-brand" href="/admin">
            Christie&apos;s Golf Ranch
            <small>Owner Dashboard</small>
          </a>
          <nav className="admin-nav">
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
      <div className="admin-layout">
        <aside className="admin-side">
          <nav>
            <div className="side-group">
              {tools.map((t) => (
                <a key={t.key} href={t.href} className={active === t.key ? "active" : ""}>
                  {t.label}
                </a>
              ))}
            </div>
            {sections.length ? (
              <div className="side-group">
                <div className="side-head">Website Pages</div>
                {sections.map((s) => {
                  const slug = slugify(s);
                  return (
                    <a
                      key={slug}
                      href={`/admin/website/${slug}`}
                      className={active === slug ? "active" : ""}
                    >
                      {s}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </nav>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
