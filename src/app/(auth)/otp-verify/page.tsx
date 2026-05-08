import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { OtpVerificationForm } from "@/components/auth/otp-verification-form";

export default function OtpVerifyPage() {
  return (
    <main className="black-hero-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-white">
      <div className="signal-grid absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link aria-label="Rare Legacy Life home" href="/">
            <BrandLogo className="h-28 w-auto" lockup="stacked" variant="dark" />
          </Link>
        </div>
        <OtpVerificationForm />
      </div>
    </main>
  );
}
