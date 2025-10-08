import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Reply, MoreHorizontal } from "lucide-react";
import { Message } from "@/lib/api-client";

interface MessageActionsModalProps {
  message: Message;
  // isOwnMessage?: boolean;
  onReply?: (messageId: string) => void;
}

export const MessageActionsDropdown: React.FC<MessageActionsModalProps> = ({
  message,
  onReply,
  // isOwnMessage,
}) => {
  const handleReply = () => {
    onReply?.(message.id);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.text);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onSelect={handleReply}>
          <Reply className="h-4 w-4 mr-2" />
          <span>Reply</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCopyText}>
          <Copy className="h-4 w-4 mr-2" />
          <span>Copy Text</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
