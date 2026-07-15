import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import PostComposer from "@/components/admin/PostComposer";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const supabase = createClient();
  const { count } = await supabase
    .from("contacts")
    .select("id", { count: "exact", head: true })
    .eq("consent", true)
    .eq("unsubscribed", false);

  return (
    <AdminShell active="posts">
      <h1 className="admin-h1">Write a post</h1>
      <p className="admin-lead">
        Three quick steps, then you&apos;ll see exactly how it looks before anything goes out.
      </p>
      <PostComposer listSize={count ?? 0} />
    </AdminShell>
  );
}
