import { useAuthStore } from "@/stores/authStore";
import { Role } from "@/types/database";
import { useMemo } from "react";
import { useParams } from "react-router";

type PermissionsRole = "admin" | "member" | "mod";

const getUserRoleForInstance = (
  roles: Role[],
  instanceId: string,
): PermissionsRole => {
  if (!instanceId) return "member";
  const roleEntry = roles.find((r) => r.instanceId === instanceId);
  return roleEntry?.role || "member";
};

const getRoleInfo = (role: PermissionsRole) => {
  const lowerRole = role.toLowerCase();
  switch (lowerRole) {
    case "admin":
      return { color: "#ff6b6b", priority: 3, name: "Admin" };
    case "mod":
      return { color: "#4ecdc4", priority: 2, name: "Moderator" };
    case "member":
      return { color: null, priority: 1, name: "Member" };
    default:
      return {
        color: null,
        priority: 0,
        name: role.charAt(0).toUpperCase() + role.slice(1),
      };
  }
};

interface InstancePermissions {
  currentUserRole: PermissionsRole;
  currentUserRolePriority: number;
  canManageMembers: boolean; // Can kick/ban/promote/demote members
  canViewAdminPanel: boolean;
}

export const useInstancePermissions = (): InstancePermissions => {
  const { instanceId } = useParams<{ instanceId: string }>();
  const { user: currentUser } = useAuthStore();

  const permissions = useMemo(() => {
    let currentUserRole: PermissionsRole = "member";
    let currentUserRolePriority = 1;
    let canManageMembers = false;
    let canViewAdminPanel = false;

    if (!currentUser || !instanceId) {
      // If no user or instance, user has no permissions within an instance
      return {
        currentUserRole,
        currentUserRolePriority,
        canManageMembers,
        canViewAdminPanel,
      };
    }

    // If they are a global admin
    if (currentUser.admin) {
      currentUserRole = "admin";
      currentUserRolePriority = 3;
      canManageMembers = true;
      canViewAdminPanel = true;
      return {
        currentUserRole: "admin",
        currentUserRolePriority: 3,
        canManageMembers: true,
        canManageRoles: true,
        canViewAdminPanel: true,
      };
    }

    // Instance-Specific Role Check
    const instanceRole = getUserRoleForInstance(currentUser.roles, instanceId);
    const roleInfo = getRoleInfo(instanceRole as PermissionsRole);

    currentUserRole = instanceRole;
    currentUserRolePriority = roleInfo.priority;

    // Define permissions based on role priority
    if (roleInfo.priority >= 3) {
      // Admin
      canManageMembers = true;
      canViewAdminPanel = true;
    } else if (roleInfo.priority === 2) {
      // Moderator
      canManageMembers = true;
      canViewAdminPanel = false;
    } else {
      // Member (priority 1 or 0)
      canManageMembers = false;
      canViewAdminPanel = false;
    }

    return {
      currentUserRole,
      currentUserRolePriority,
      canManageMembers,
      canViewAdminPanel,
    };
  }, [currentUser, instanceId]);

  return permissions as InstancePermissions;
};
