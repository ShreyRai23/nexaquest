import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export type Role = "child" | "parent";
const KEY = "mb.role";

export function getRole(): Role {
  if (typeof window === "undefined") return "child";
  const v = window.localStorage.getItem(KEY);
  return v === "parent" ? "parent" : "child";
}

export function setRole(r: Role) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, r);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("mb-role-change"));
}

export function useRole(): Role | null {
  const [role, set] = useState<Role | null>(null);
  useEffect(() => {
    set(getRole());
    const h = () => set(getRole());
    window.addEventListener("mb-role-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("mb-role-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return role;
}

/** Redirect users whose role doesn't match the page's allowed role. */
export function useRoleGuard(allowed: Role) {
  const role = useRole();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== null && role !== allowed) {
      navigate({ to: allowed === "child" ? "/parent" : "/dashboard" });
    }
  }, [role, allowed, navigate]);
}
