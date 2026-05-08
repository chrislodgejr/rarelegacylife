import { NextResponse } from "next/server";
import { getLandingPath } from "@/lib/auth/routing";
import { ensureProfileForAuthUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types/domain";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_oauth_code", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("OAuth exchange failed:", exchangeError.message);

    return NextResponse.redirect(
      new URL(
        `/login?error=oauth_exchange_failed&message=${encodeURIComponent(
          exchangeError.message
        )}`,
        requestUrl.origin
      )
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("OAuth user lookup failed:", userError?.message);

    return NextResponse.redirect(
      new URL("/login?error=no_oauth_user", requestUrl.origin)
    );
  }

  await ensureProfileForAuthUser(user);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("auth_user_id", user.id)
    .maybeSingle<Pick<Profile, "role" | "status">>();

  if (profileError) {
    console.error("OAuth profile lookup failed:", profileError.message);

    return NextResponse.redirect(
      new URL(
        `/login?error=profile_lookup_failed&message=${encodeURIComponent(
          profileError.message
        )}`,
        requestUrl.origin
      )
    );
  }

  const role =
    profile?.status === "active" ? (profile.role as AppRole) : "pending";

  return NextResponse.redirect(
    new URL(next || getLandingPath(role), requestUrl.origin)
  );
}
