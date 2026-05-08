import { redirect } from "next/navigation";
import { getLandingPath } from "@/lib/auth/routing";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types/domain";

export async function getCurrentUserAndProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle<Profile>();

  return { user, profile };
}

export async function requireAuthenticatedProfile() {
  const { user, profile } = await getCurrentUserAndProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile || profile.role === "pending" || profile.status !== "active") {
    redirect("/pending-approval");
  }

  return { user, profile };
}

export async function requireRole(roles: AppRole[]) {
  const session = await requireAuthenticatedProfile();

  if (!roles.includes(session.profile.role)) {
    redirect(getLandingPath(session.profile.role));
  }

  return session;
}

export async function ensureProfileForAuthUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  if (!user.email) {
    return null;
  }

  const admin = createAdminClient();
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;
  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;

  const { data } = await admin
    .from("profiles")
    .upsert(
      {
        auth_user_id: user.id,
        email: user.email.toLowerCase(),
        full_name: fullName,
        avatar_url: avatarUrl,
        role: "pending",
        status: "pending",
      },
      {
        onConflict: "auth_user_id",
        ignoreDuplicates: true,
      },
    )
    .select("*")
    .maybeSingle<Profile>();

  return data;
}
