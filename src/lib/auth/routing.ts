import type { AppRole } from "@/types/domain";

export function getLandingPath(role?: AppRole | null) {
  if (role === "admin" || role === "manager") {
    return "/admin/dashboard";
  }

  if (role === "agent") {
    return "/agent/dashboard";
  }

  return "/pending-approval";
}
