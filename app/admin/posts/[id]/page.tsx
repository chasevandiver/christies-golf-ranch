import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import PostComposer from "@/components/admin/PostComposer";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: post }, { count }] = await Promise.all([
    supabase
      .from("posts")
      .select("id,body,media_url,channels,email_subject,scheduled_at,status")
      .eq("id", params.id)
      .single(),
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("consent", true)
      .eq("unsubscribed", false),
  ]);

  if (!post) notFound();
  if (post.status === "sent" || post.status === "sending") {
    // Already out the door — nothing to edit.
    return (
      <AdminShell active="posts">
        <h1 className="admin-h1">This post already went out</h1>
        <p className="admin-lead">
          Sent posts can&apos;t be changed. You can write a new one instead.
        </p>
        <a className="btn-save" style={{ textDecoration: "none" }} href="/admin/posts/new">
          + Write a new post
        </a>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="posts">
      <h1 className="admin-h1">Change this post</h1>
      <p className="admin-lead">
        Make your changes, preview, and it&apos;ll be re-scheduled.
      </p>
      <PostComposer listSize={count ?? 0} existing={post} />
    </AdminShell>
  );
}
