import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";

export default function PendingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF] px-4 py-12">
      <section className="premium-card w-full max-w-lg rounded-2xl p-8 text-center">
        <BrandLogo className="mx-auto h-28 w-auto" lockup="stacked" variant="light" />
        <div className="gold-gradient-button mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="font-premium mt-6 text-2xl font-semibold text-[#050505]">
          Your account has been created and is awaiting approval.
        </h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          A Rare Legacy Life administrator must approve your account before you can access the
          portal.
        </p>
        <Link
          className="gold-gradient-button mt-6 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
