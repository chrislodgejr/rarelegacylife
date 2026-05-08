import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getLandingPath } from "@/lib/auth/routing";
import type { AppRole, Profile } from "@/types/domain";

const protectedPrefixes = ["/admin", "/agent"];
const authOnlyPrefixes = ["/pending-approval"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const needsAuth =
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    authOnlyPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!needsAuth && pathname !== "/login") {
    return response;
  }

  if (!user) {
    if (needsAuth) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("auth_user_id", user.id)
    .maybeSingle<Pick<Profile, "id" | "role" | "status">>();

  const role = profile?.status === "active" ? (profile.role as AppRole) : "pending";

  if (pathname === "/login") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getLandingPath(role);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/pending-approval")) {
    if (role !== "pending") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getLandingPath(role);
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  if (role === "pending") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/pending-approval";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/admin") && role !== "admin" && role !== "manager") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getLandingPath(role);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/agent") && role !== "agent") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getLandingPath(role);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
