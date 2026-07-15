import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor, { type Block } from "@/components/admin/ContentEditor";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function WebsiteSectionPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("content_blocks")
    .select("key,section,label,help,type,value,sort")
    .order("sort");

  const blocks = ((data ?? []) as Block[]).filter((b) => slugify(b.section) === params.slug);
  if (blocks.length === 0) notFound();

  const sectionName = blocks[0].section;

  return (
    <AdminShell active={params.slug}>
      <h1 className="admin-h1">{sectionName}</h1>
      <p className="admin-lead">
        Change any of the words or pictures below, then press <strong>Save changes</strong>.
        It&apos;ll update on the website within a minute.
      </p>
      <ContentEditor sections={[[sectionName, blocks]]} />
    </AdminShell>
  );
}
