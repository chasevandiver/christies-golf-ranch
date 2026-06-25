import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import ContactsManager, { type Contact } from "@/components/admin/ContactsManager";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("contacts")
    .select("id,email,name,phone,source,consent,unsubscribed,created_at")
    .order("created_at", { ascending: false });

  return (
    <AdminShell active="contacts">
      <h1 className="admin-h1">Email List</h1>
      <ContactsManager contacts={(data ?? []) as Contact[]} />
    </AdminShell>
  );
}
