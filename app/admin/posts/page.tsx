import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import PostsQueue, { type PostRow } from "@/components/admin/PostsQueue";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("id,body,media_url,channels,email_subject,scheduled_at,status,result_log")
    .order("scheduled_at", { ascending: false })
    .limit(200);

  const posts = (data ?? []) as PostRow[];

  return (
    <AdminShell active="posts">
      <div className="toolbar">
        <div>
          <h1 className="admin-h1">Social &amp; Email Posts</h1>
          <p className="admin-lead" style={{ marginBottom: 0 }}>
            One message, sent to Facebook, Instagram, and your email list. Scheduled posts go
            out automatically within a few minutes of their time.
          </p>
        </div>
        <a className="btn-save" style={{ textDecoration: "none" }} href="/admin/posts/new">
          + Write a post
        </a>
      </div>
      <PostsQueue posts={posts} />
    </AdminShell>
  );
}
