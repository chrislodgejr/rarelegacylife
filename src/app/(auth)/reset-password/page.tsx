import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { ResetPasswordForm } from "@/components/auth/password-reset-forms";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF] px-4 py-12">
      <div className="w-full max-w-md">
        <Link aria-label="Rare Legacy Life home" className="mb-6 inline-block" href="/">
          <BrandLogo className="h-24 w-auto" lockup="stacked" variant="light" />
        </Link>
        <Link className="mb-6 inline-block text-sm font-semibold text-[#050505]" href="/login">
          Back to login
        </Link>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
