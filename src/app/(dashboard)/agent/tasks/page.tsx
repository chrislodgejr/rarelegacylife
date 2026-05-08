import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function AgentTasksPage() {
  const { profile } = await requireRole(["agent"]);
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("lead_tasks")
    .select("id, title, description, due_date, priority, status, lead_id, leads(first_name, last_name)")
    .eq("assigned_user_id", profile.id)
    .in("status", ["open", "in_progress", "overdue"])
    .order("due_date", { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#050505]">Tasks</h1>
      <p className="mt-2 text-sm text-neutral-600">Open follow-ups assigned to you.</p>
      <div className="mt-6 grid gap-3">
        {(tasks ?? []).map((task) => (
          <Link key={task.id} className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-[#C9A227]" href={`/agent/leads/${task.lead_id}`}>
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="font-semibold text-[#050505]">{task.title}</p>
                <p className="mt-1 text-sm text-neutral-600">{task.description ?? "No description"}</p>
              </div>
              <div className="text-sm text-neutral-600">
                {task.status} | {task.priority}
                <p className="mt-1">{task.due_date ? new Date(task.due_date).toLocaleString() : "No due date"}</p>
              </div>
            </div>
          </Link>
        ))}
        {!tasks?.length ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            No open tasks.
          </div>
        ) : null}
      </div>
    </div>
  );
}
