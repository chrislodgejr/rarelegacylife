import { NextResponse } from "next/server";
import { getLandingPath } from "@/lib/auth/routing";
import { ensureProfileForAuthUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types/domain";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await ensureProfileForAuthUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("auth_user_id", user.id)
        .maybeSingle<Pick<Profile, "role" | "status">>();

      const role = profile?.status === "active" ? (profile.role as AppRole) : "pending";
      return NextResponse.redirect(new URL(next || getLandingPath(role), requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
