import { useAuth } from "@/lib/auth";
import { ChildNavbar } from "./ChildNavbar";
import { ParentNavbar } from "./ParentNavbar";

/** Renders the correct navbar based on authenticated user role. */
export function RoleNavbar() {
  const { user } = useAuth();
  return user?.role === "parent" ? <ParentNavbar /> : <ChildNavbar />;
}
