import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const supabase = createClient();

  let upcoming = 0;
  let listSize = 0;
  try {
    const [posts, contacts] = await Promise.all([
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("consent", true)
        .eq("unsubscribed", false),
    ]);
    upcoming = posts.count ?? 0;
    listSize = contacts.count ?? 0;
  } catch {
    // Counts are decoration — the buttons still work.
  }

  const cards = [
    {
      href: "/admin/posts/new",
      title: "Write a post",
      desc: "Send one message to Facebook, Instagram, and your email list — you pick where and when.",
    },
    {
      href: "/admin/posts",
      title: "See scheduled & sent posts",
      desc: upcoming
        ? `${upcoming} post${upcoming === 1 ? "" : "s"} waiting to go out.`
        : "Nothing scheduled right now.",
    },
    {
      href: "/admin/events",
      title: "Events calendar",
      desc: "Add or change Play Days, camps, and the men's group.",
    },
    {
      href: "/admin/contacts",
      title: "Email list",
      desc: `${listSize} ${listSize === 1 ? "person" : "people"} signed up. View or download the list.`,
    },
  ];

  return (
    <AdminShell active="home">
      <h1 className="admin-h1">Welcome back</h1>
      <p className="admin-lead">
        What would you like to do today? To change words or photos on the website, pick a page
        from the <strong>Website Pages</strong> list on the left.
      </p>
      <div className="home-grid">
        {cards.map((c) => (
          <a className="home-card" href={c.href} key={c.href}>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </a>
        ))}
      </div>
    </AdminShell>
  );
}
