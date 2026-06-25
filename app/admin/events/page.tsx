import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import EventsManager, { type EventRecord } from "@/components/admin/EventsManager";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("id,title,description,start_date,start_time,end_time,price,location,recurrence,recurrence_dow,is_published")
    .order("start_date");

  return (
    <AdminShell active="events">
      <h1 className="admin-h1">Events Calendar</h1>
      <EventsManager events={(data ?? []) as EventRecord[]} />
    </AdminShell>
  );
}
