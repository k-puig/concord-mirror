import React from "react";
import { useParams } from "react-router";
import { Crown, Shield, UserIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Role, User } from "@/types/database";
import { useInstanceMembers } from "@/hooks/useServers";
import { useAuthStore } from "@/stores/authStore";

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-status-online";
    case "away":
      return "bg-status-away";
    case "busy":
      return "bg-status-busy";
    default:
      return "bg-status-offline";
  }
};

interface MemberItemProps {
  member: User;
  instanceId: string;
  isOwner?: boolean;
  currentUserRolePriority: number;
}

const getUserRoleForInstance = (roles: Role[], instanceId: string): string => {
  if (!instanceId) return "member";
  const roleEntry = roles.find((r) => r.instanceId === instanceId);
  return roleEntry?.role || "member";
};

const getRoleInfo = (role: string) => {
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

const MemberItem: React.FC<MemberItemProps> = ({
  member,
  instanceId,
  isOwner = false,
  currentUserRolePriority,
}) => {
  // Determine the role for this specific instance
  const userRole = getUserRoleForInstance(member.roles, instanceId);
  const roleInfo = getRoleInfo(userRole);
  const memberRolePriority = roleInfo.priority;

  // Consider if this member is a global admin as well
  const isGlobalAdmin = member.admin || false;
  let effectiveRoleInfo = roleInfo;
  let effectiveMemberRolePriority = memberRolePriority;

  if (isGlobalAdmin && roleInfo.priority < 3) {
    effectiveRoleInfo = getRoleInfo("admin");
    effectiveMemberRolePriority = 3;
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start p-2 h-auto hover:bg-concord-tertiary/50"
      // disable if the current member is an admin
      disabled={currentUserRolePriority < 3 || effectiveMemberRolePriority >= 3}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={member.picture || undefined}
              alt={member.username}
            />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {member.username?.slice(0, 2).toUpperCase() || "???"}
            </AvatarFallback>
          </Avatar>
          {/* Status indicator */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar ${getStatusColor(member.status)}`}
          />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1">
            {isOwner && (
              <Crown size={12} className="text-yellow-500 flex-shrink-0" />
            )}
            {/* Display Shield for Admins and Mods, not for Members */}
            {!isOwner && effectiveMemberRolePriority > 1 && (
              <Shield
                size={12}
                className="flex-shrink-0"
                style={{
                  color: effectiveRoleInfo.color || "var(--background)",
                }}
              />
            )}
            <span
              className="text-sm font-medium truncate"
              style={{
                color: effectiveRoleInfo.color || "var(--color-text-primary)",
              }}
            >
              {member.nickname || member.username}
            </span>
          </div>
          {member.bio && (
            <div className="text-xs text-concord-secondary truncate">
              {member.bio}
            </div>
          )}
        </div>
      </div>
    </Button>
  );
};

const MemberList: React.FC = () => {
  const { instanceId } = useParams<{ instanceId: string }>();
  const { data: members, isLoading } = useInstanceMembers(instanceId);
  const { user: currentUser } = useAuthStore();

  const currentUserRoleInfo = React.useMemo(() => {
    if (!currentUser || !instanceId) {
      return { role: "member", priority: 1, name: "Member", color: null };
    }

    // If the current user is a global admin, they are effectively an admin of any instance.
    if (currentUser.admin) {
      return { role: "admin", priority: 3, name: "Admin", color: "#ff6b6b" };
    }

    const role = getUserRoleForInstance(currentUser.roles, instanceId);
    return { ...getRoleInfo(role), role: role };
  }, [currentUser, instanceId]);

  if (!instanceId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-concord-secondary text-sm">No members found</div>
      </div>
    );
  }

  // Group members by their role for the current instance.
  const groupedMembers = members.reduce(
    (acc, member) => {
      // Determine the effective role for this instance.
      let effectiveRoleName = getUserRoleForInstance(
        member.roles as Role[],
        instanceId,
      );

      // Global admin is instance admin
      if (member.admin && effectiveRoleName !== "admin") {
        effectiveRoleName = "admin";
      }

      const roleInfo = getRoleInfo(effectiveRoleName);

      if (!acc[roleInfo.name]) {
        acc[roleInfo.name] = [];
      }
      acc[roleInfo.name].push(member as User);
      return acc;
    },
    {} as Record<string, User[]>,
  );

  // Get all unique role names present and sort them by priority.
  const sortedRoleNames = Object.keys(groupedMembers).sort(
    (roleNameA, roleNameB) => {
      const priorityA = getRoleInfo(roleNameA).priority;
      const priorityB = getRoleInfo(roleNameB).priority;
      return priorityB - priorityA;
    },
  );

  return (
    <div className="flex flex-col flex-1 border-l border-concord-primary h-full bg-concord-secondary">
      {/* Header */}
      <div className="px-4 py-3 border-b border-concord-primary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserIcon size={20} className="text-concord-primary" />
          <p className="text-sm font-semibold text-concord-primary tracking-wide">
            Members
          </p>
        </div>
        <p className="text-sm font-medium text-concord-secondary tracking-wide">
          {members.length}
        </p>
      </div>

      {/* Member List */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {sortedRoleNames.map((roleName) => {
            const roleMembers = groupedMembers[roleName];
            // Sort members within each role group alphabetically by username.
            const sortedMembers = roleMembers.sort((a, b) =>
              (a.nickname || a.username).localeCompare(
                b.nickname || b.username,
              ),
            );

            return (
              <div key={roleName} className="mb-4">
                {/* Role Header */}
                <div className="px-4 py-1">
                  <h4 className="text-xs font-semibold text-concord-secondary uppercase tracking-wide">
                    {roleName} — {roleMembers.length}
                  </h4>
                </div>

                {/* Role Members */}
                <div className="space-y-1">
                  {sortedMembers.map((member) => (
                    <MemberItem
                      key={member.id}
                      member={member}
                      instanceId={instanceId}
                      currentUserRolePriority={currentUserRoleInfo.priority}
                      isOwner={false}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemberList;
