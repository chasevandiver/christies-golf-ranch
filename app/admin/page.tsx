import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor, { type Block } from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("content_blocks")
    .select("key,section,label,help,type,value,sort")
    .order("section")
    .order("sort");

  const blocks = (data ?? []) as Block[];

  // Group into sections, preserving the order they first appear.
  const order: string[] = [];
  const map = new Map<string, Block[]>();
  for (const b of blocks) {
    if (!map.has(b.section)) {
      map.set(b.section, []);
      order.push(b.section);
    }
    map.get(b.section)!.push(b);
  }
  const sections: [string, Block[]][] = order.map((s) => [s, map.get(s)!]);

  return (
    <AdminShell active="content">
      <h1 className="admin-h1">Website Text &amp; Photos</h1>
      <p className="admin-lead">
        Change any of the words or pictures on your website below. Edit a section, press{" "}
        <strong>Save changes</strong>, and it&apos;ll update on the site within a minute.
      </p>
      <ContentEditor sections={sections} />
    </AdminShell>
  );
}
