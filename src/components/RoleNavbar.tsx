import { useRole } from "@/lib/role";
import { ChildNavbar } from "./ChildNavbar";
import { ParentNavbar } from "./ParentNavbar";

/** Renders the navbar that matches the current user role. */
export function RoleNavbar() {
  const role = useRole();
  return role === "parent" ? <ParentNavbar /> : <ChildNavbar />;
}
