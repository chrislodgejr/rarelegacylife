export default function AdminSettingsPage() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h1 className="text-3xl font-semibold text-[#050505]">Settings</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        System settings are stored in Supabase through `system_settings`. The first settings cover
        lead assignment and future SLA defaults. A full settings UI should wait until the core CRM
        workflow is stable.
      </p>
    </div>
  );
}
