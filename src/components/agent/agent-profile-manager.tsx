"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { US_STATES } from "@/lib/constants/options";
import {
  addAgentLicense,
  removeAgentLicense,
  removeCarrierContract,
  saveCarrierContract,
  updateAgentProfile,
  type AgentProfileActionState,
} from "@/server/actions/agent-profile";

const initialState: AgentProfileActionState = { ok: false, message: "" };

type AgentProfileManagerProps = {
  agent: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    state: string | null;
    npn: string | null;
    accepts_new_leads: boolean;
    max_active_leads: number;
    current_active_leads: number;
  };
  licenses: {
    id: string;
    state: string;
    license_number: string | null;
    expiration_date: string | null;
    license_status: string;
  }[];
  carriers: {
    id: string;
    name: string;
  }[];
  contracts: {
    id: string;
    carrier_id: string;
    writing_number: string | null;
    notes: string | null;
    carriers: { name: string } | { name: string }[] | null;
  }[];
};

export function AgentProfileManager({ agent, licenses, carriers, contracts }: AgentProfileManagerProps) {
  const [profileState, profileAction] = useActionState(updateAgentProfile, initialState);
  const [licenseState, licenseAction] = useActionState(addAgentLicense, initialState);
  const [contractState, contractAction] = useActionState(saveCarrierContract, initialState);
  const [removeLicenseState, removeLicenseAction] = useActionState(removeAgentLicense, initialState);
  const [removeContractState, removeContractAction] = useActionState(removeCarrierContract, initialState);
  const contractedCarrierIds = new Set(contracts.map((contract) => contract.carrier_id));
  const availableCarriers = carriers.filter((carrier) => !contractedCarrierIds.has(carrier.id));

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6A16]">Agent profile</p>
            <h1 className="font-premium mt-2 text-3xl font-semibold text-[#050505]">
              {agent.first_name} {agent.last_name}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">{agent.email}</p>
          </div>
          <div className="rounded-xl bg-[#F7F5EF] px-4 py-3 text-sm text-neutral-700">
            <strong className="text-[#050505]">{agent.current_active_leads}</strong> active leads / max {agent.max_active_leads}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <form action={profileAction} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <input name="agent_id" type="hidden" value={agent.id} />
          <h2 className="font-premium text-xl font-semibold text-[#050505]">Core details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="First name" name="first_name" defaultValue={agent.first_name} required />
            <Field label="Last name" name="last_name" defaultValue={agent.last_name} required />
            <Field label="Phone" name="phone" defaultValue={agent.phone ?? ""} />
            <Field label="NPN" name="npn" defaultValue={agent.npn ?? ""} />
            <label>
              <span className="text-sm font-medium text-neutral-700">Primary state</span>
              <select className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm" name="state" defaultValue={agent.state ?? ""}>
                <option value="">Select</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>
            <Field label="Max active leads" name="max_active_leads" type="number" min="0" defaultValue={agent.max_active_leads} />
          </div>
          <label className="mt-4 flex gap-3 text-sm text-neutral-700">
            <input className="mt-1 h-4 w-4 accent-[#C9A227]" name="accepts_new_leads" type="checkbox" defaultChecked={agent.accepts_new_leads} />
            <span>Accepting new leads</span>
          </label>
          <InlineState state={profileState} />
          <div className="mt-4 max-w-xs"><SubmitButton>Save profile</SubmitButton></div>
        </form>

        <form action={licenseAction} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <input name="agent_id" type="hidden" value={agent.id} />
          <h2 className="font-premium text-xl font-semibold text-[#050505]">Add licensed state</h2>
          <div className="mt-4 grid gap-4">
            <label>
              <span className="text-sm font-medium text-neutral-700">State</span>
              <select className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm" name="state" required>
                <option value="">Select</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>
            <Field label="License number" name="license_number" />
            <Field label="Expiration date" name="expiration_date" type="date" />
          </div>
          <InlineState state={licenseState} />
          <div className="mt-4"><SubmitButton>Add / update license</SubmitButton></div>
        </form>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-premium text-xl font-semibold text-[#050505]">Licensed states</h2>
            <p className="mt-1 text-sm text-neutral-600">Add every state where this agent can write business.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {licenses.map((license) => (
            <div key={license.id} className="rounded-xl bg-[#F7F5EF] p-4 text-sm">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#050505]">{license.state}</p>
                  <p className="mt-1 text-neutral-600">{license.license_number || "No license number"}</p>
                  <p className="mt-1 text-xs text-neutral-500">{license.expiration_date ? `Expires ${license.expiration_date}` : "No expiration date"}</p>
                </div>
                <form action={removeLicenseAction}>
                  <input name="agent_id" type="hidden" value={agent.id} />
                  <input name="license_id" type="hidden" value={license.id} />
                  <button className="text-xs font-semibold text-red-700 hover:underline" type="submit">Remove</button>
                </form>
              </div>
            </div>
          ))}
          {!licenses.length ? <p className="text-sm text-neutral-500">No licensed states added yet.</p> : null}
        </div>
        <InlineState state={removeLicenseState} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form action={contractAction} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <input name="agent_id" type="hidden" value={agent.id} />
          <h2 className="font-premium text-xl font-semibold text-[#050505]">Add carrier contract</h2>
          <div className="mt-4 grid gap-4">
            <label>
              <span className="text-sm font-medium text-neutral-700">Carrier</span>
              <select className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm" name="carrier_id" required>
                <option value="">Select carrier</option>
                {availableCarriers.map((carrier) => (
                  <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                ))}
              </select>
            </label>
            <Field label="Writing number" name="writing_number" />
            <label>
              <span className="text-sm font-medium text-neutral-700">Notes</span>
              <textarea className="mt-2 min-h-20 w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm" name="notes" />
            </label>
          </div>
          <InlineState state={contractState} />
          <div className="mt-4"><SubmitButton>Save carrier</SubmitButton></div>
        </form>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="font-premium text-xl font-semibold text-[#050505]">Carrier writing numbers</h2>
          <p className="mt-1 text-sm text-neutral-600">Only add carriers the agent is contracted with.</p>
          <div className="mt-4 grid gap-3">
            {contracts.map((contract) => (
              <div key={contract.id} className="rounded-xl bg-[#F7F5EF] p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#050505]">{carrierName(contract.carriers)}</p>
                    <p className="mt-1 text-neutral-600">Writing #: {contract.writing_number || "Not entered"}</p>
                    {contract.notes ? <p className="mt-1 text-xs text-neutral-500">{contract.notes}</p> : null}
                  </div>
                  <form action={removeContractAction}>
                    <input name="agent_id" type="hidden" value={agent.id} />
                    <input name="contract_id" type="hidden" value={contract.id} />
                    <button className="text-xs font-semibold text-red-700 hover:underline" type="submit">Remove</button>
                  </form>
                </div>
              </div>
            ))}
            {!contracts.length ? <p className="text-sm text-neutral-500">No carrier contracts added yet.</p> : null}
          </div>
          <InlineState state={removeContractState} />
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm" name={name} {...props} />
    </label>
  );
}

function InlineState({ state }: { state: AgentProfileActionState }) {
  if (!state.message) return null;
  return <p className={`mt-3 rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>;
}

function carrierName(value: AgentProfileManagerProps["contracts"][number]["carriers"]) {
  const carrier = Array.isArray(value) ? value[0] : value;
  return carrier?.name ?? "Carrier";
}
