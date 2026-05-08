import { NextResponse } from "next/server";
import { ensureProfileForAuthUser } from "@/lib/auth/session";
import { getLandingPath } from "@/lib/auth/routing";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types/domain";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("auth_user_id", user.id)
    .maybeSingle<Pick<Profile, "role" | "status">>();
  const profile = existingProfile ?? (await ensureProfileForAuthUser(user));

  const role = profile?.status === "active" ? (profile.role as AppRole) : "pending";

  return NextResponse.redirect(new URL(getLandingPath(role), requestUrl.origin));
}
