import { PushEnrollment } from "@/components/dashboard/push-enrollment";

export default function AdminSettingsPage() {
  return <div className="space-y-5">
    <h1 className="font-premium text-3xl font-semibold">CRM settings</h1>
    <section className="premium-card rounded-2xl p-5"><h2 className="text-xl font-semibold">Notifications</h2><p className="my-3 text-sm text-neutral-600">Install Rare Legacy CRM on your home screen, then allow notifications for new inquiries. Each device needs to opt in once.</p><PushEnrollment /></section>
    <section className="premium-card rounded-2xl p-5"><h2 className="text-xl font-semibold">Your workspace</h2><p className="mt-3 text-sm text-neutral-600">Quotes and retirement inquiries are shared between Chris and Dan. No lead assignment is required.</p></section>
  </div>;
}
