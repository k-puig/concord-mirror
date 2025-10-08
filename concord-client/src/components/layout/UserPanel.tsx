import React from "react";
import { Settings, Mic, MicOff, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuthStore } from "@/stores/authStore";
import { useVoiceStore } from "@/stores/voiceStore";
import { useNavigate } from "react-router";

// Status color utility
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

// Voice Controls Component
interface VoiceControlsProps {
  isMuted: boolean;
  isDeafened: boolean;
  onMuteToggle: () => void;
  onDeafenToggle: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isMuted,
  isDeafened,
  onMuteToggle,
  onDeafenToggle,
}) => {
  return (
    <div className="flex items-center space-x-1">
      <TooltipProvider>
        {/* Mute/Unmute */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isMuted ? "text-destructive hover:text-destructive/80" : "interactive-hover"}`}
              onClick={onMuteToggle}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isMuted ? "Unmute" : "Mute"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Deafen/Undeafen */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isDeafened ? "text-destructive hover:text-destructive/80" : "interactive-hover"}`}
              onClick={onDeafenToggle}
            >
              <Headphones size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDeafened ? "Undeafen" : "Deafen"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Settings */}
      </TooltipProvider>
    </div>
  );
};

// User Avatar Component
interface UserAvatarProps {
  user: any;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  showStatus = true,
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const statusSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.picture || undefined} alt={user.username} />
        <AvatarFallback className="text-xs text-primary-foreground bg-primary">
          {user.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${statusSizeClasses[size]} rounded-full border-2 border-sidebar ${getStatusColor(user.status)}`}
        />
      )}
    </div>
  );
};

const UserPanel: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { isConnected, isMuted, isDeafened, toggleMute, toggleDeafen } =
    useVoiceStore();

  return (
    <div className="user-panel flex items-center p-3 bg-concord-tertiary border-t border-sidebar min-h-16 rounded-xl m-2">
      {/* User Info */}
      <UserAvatar user={user} size="md" />
      <div className="ml-2 flex-1 min-w-0 text-left">
        <div className="text-sm font-medium text-concord-primary truncate">
          {user?.nickname || user?.username}
        </div>
        <div className="text-xs text-concord-secondary truncate capitalize">
          {user?.status}
        </div>
      </div>

      {/* Voice Controls */}
      {isConnected && (
        <VoiceControls
          isMuted={isMuted}
          isDeafened={isDeafened}
          onMuteToggle={toggleMute}
          onDeafenToggle={toggleDeafen}
        />
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 interactive-hover"
              onClick={() => navigate("/settings")}
            >
              <Settings size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>User Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UserPanel;
