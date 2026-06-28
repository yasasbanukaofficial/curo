import { useVerifySessionQuery, useGetTeamMembersQuery } from "../store";
import type { TeamMember } from "../types";

export function useTeamRole(teamId: string | null) {
  const { data: currentUser } = useVerifySessionQuery(undefined, { skip: !teamId });
  const { data: members } = useGetTeamMembersQuery(teamId ?? "", { skip: !teamId });

  const currentUserId = (currentUser as any)?._id ?? (currentUser as any)?.id;

  const member = (members ?? []).find((m: TeamMember) => {
    const memberUserId =
      typeof m.userId === "object" && m.userId !== null
        ? (m.userId as any)?._id ?? (m.userId as any)?.id
        : m.userId;
    return memberUserId === currentUserId;
  });

  const role = member?.role ?? "viewer";

  const canCreate = ["owner", "admin", "developer"].includes(role);
  const canEdit = ["owner", "admin"].includes(role);
  const canDelete = ["owner", "admin"].includes(role);
  const canManageMembers = ["owner", "admin"].includes(role);
  const canViewSecretValues = ["owner", "admin", "developer"].includes(role);
  const canViewAuditLogs = ["owner", "admin"].includes(role);

  function canDeleteResource(resourceUserId: string | undefined): boolean {
    if (!resourceUserId) return false;
    if (role === "owner" || role === "admin") return true;
    if (role === "developer") return resourceUserId === currentUserId;
    return false;
  }

  return { role, currentUserId, canCreate, canEdit, canDelete, canManageMembers, canViewSecretValues, canViewAuditLogs, canDeleteResource };
}