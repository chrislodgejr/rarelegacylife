import { PushEnrollment } from "@/components/dashboard/push-enrollment";

export default function AdminSettingsPage() {
  return <div className="space-y-5">
    <h1 className="font-premium text-3xl font-semibold">CRM settings</h1>
    <section className="premium-card rounded-2xl p-5"><h2 className="text-xl font-semibold">Notifications</h2><p className="my-3 text-sm text-neutral-600">New quote and retirement requests notify subscribed CRM devices. On iPhone, open the site in Safari, choose Share → Add to Home Screen, sign in from that app, then tap the button below and allow notifications. Each person must enable their own device.</p><PushEnrollment /></section>
    <section className="premium-card rounded-2xl p-5"><h2 className="text-xl font-semibold">Your workspace</h2><p className="mt-3 text-sm text-neutral-600">Quotes and retirement inquiries are shared between Chris, Dan, and Christian. No lead assignment is required.</p></section>
  </div>;
}
