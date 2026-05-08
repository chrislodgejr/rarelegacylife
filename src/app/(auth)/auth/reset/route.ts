import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const recoveryToken = requestUrl.searchParams.get("token_hash");
  const linkType = requestUrl.searchParams.get("type");
  const supabase = await createClient();

  if (recoveryToken && linkType === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: recoveryToken,
      type: "recovery",
    });

    if (error) {
      return NextResponse.redirect(new URL("/forgot-password?error=reset_link_failed", requestUrl.origin));
    }

    return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL("/forgot-password?error=reset_link_failed", requestUrl.origin));
    }

    return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
  }

  return NextResponse.redirect(new URL("/forgot-password?error=missing_reset_code", requestUrl.origin));
}
