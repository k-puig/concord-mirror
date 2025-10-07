import { Message } from "@/lib/api-client";
import { useState, useRef, useEffect } from "react";
import { useSendMessage } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageUser {
  id: string;
  username?: string;
  nickname?: string | null;
  picture?: string | null;
}
interface MessageInputProps {
  channelId: string;
  channelName?: string;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  replyingToUser: MessageUser | null;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  channelId,
  channelName,
  replyingTo,
  onCancelReply,
  replyingToUser,
}) => {
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Use the API hook for sending messages
  const sendMessageMutation = useSendMessage();

  // Auto-resize textarea (using direct DOM access as a fallback, no ref needed)
  useEffect(() => {
    const textarea = document.getElementById(
      "message-input-textarea",
    ) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !sendMessageMutation.isPending) {
      try {
        await sendMessageMutation.mutateAsync({
          channelId,
          content: content.trim(),
          repliedMessageId: replyingTo?.id || null,
        });
        setContent("");
        onCancelReply?.();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="px-2 pb-2">
      {replyingTo && replyingToUser && (
        <div className="mb-2 p-3 bg-concord-secondary rounded-lg border border-b-0 border-border">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 border-l-2 border-t-2 border-concord-secondary/50 rounded-tl-md ml-2" />
              <span className="font-medium text-concord-primary">
                {replyingToUser.nickname || replyingToUser.username}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-concord-secondary hover:text-concord-primary"
              onClick={onCancelReply}
            >
              ×
            </Button>
          </div>
          <div className="text-sm text-concord-primary truncate pl-2">
            {replyingTo.text.replace(/```[\s\S]*?```/g, "[code]")}
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <Textarea
          id="message-input-textarea" // Unique ID for DOM targeting
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName || "channel"}`}
          disabled={sendMessageMutation.isPending}
          className="w-full bg-concord-tertiary border border-border rounded-lg px-4 py-3 text-concord-primary placeholder-concord-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 min-h-8 max-h-56"
        />
      </form>
    </div>
  );
};
