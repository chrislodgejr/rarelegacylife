"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { ROLE_LABELS } from "@/lib/constants/options";
import { approveUser } from "@/server/actions/crm";

const initialState = { ok: false, message: "" };
const approvableRoles = ["admin", "manager", "agent", "client", "support"] as const;

export function UserApprovalForm({
  profileId,
  currentRole,
  currentStatus,
}: {
  profileId: string;
  currentRole: string;
  currentStatus: string;
}) {
  const [state, action] = useActionState(approveUser, initialState);

  return (
    <form action={action} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <input name="profile_id" type="hidden" value={profileId} />
      <label>
        <span className="text-xs font-medium text-neutral-600">Role</span>
        <select
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
          name="role"
          defaultValue={currentRole === "pending" ? "agent" : currentRole}
        >
          {approvableRoles.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="text-xs font-medium text-neutral-600">Status</span>
        <select
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
          name="status"
          defaultValue={currentStatus === "pending" ? "active" : currentStatus}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
      <SubmitButton>Save</SubmitButton>
      {state.message ? (
        <p className={`sm:col-span-3 text-sm ${state.ok ? "text-emerald-700" : "text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
