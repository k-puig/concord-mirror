import { Copy, Reply, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  dark,
  solarizedLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "@/components/theme-provider";
import { Message } from "@/lib/api-client";
import { useState } from "react";

// User type for message component
interface MessageUser {
  id: string;
  username?: string;
  nickname?: string | null;
  picture?: string | null;
}

// Message Props interface
interface MessageProps {
  message: Message;
  user: MessageUser;
  replyTo?: Message;
  replyToUser?: MessageUser;
  onReply?: (messageId: string) => void;
}

export const MessageComponent: React.FC<MessageProps> = ({
  message,
  user,
  replyTo,
  replyToUser,
  onReply,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    try {
      // First try parsing as ISO string
      let date = parseISO(timestamp);

      // If that fails, try regular Date constructor
      if (!isValid(date)) {
        date = new Date(timestamp);
      }

      // Final check if date is valid
      if (!isValid(date)) {
        console.error("Invalid timestamp:", timestamp);
        return "Invalid date";
      }

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting timestamp:", timestamp, error);
      return "Invalid date";
    }
  };
  // const isOwnMessage = currentUser?.id === message.userId;
  const { mode } = useTheme();

  // Get username with fallback
  const username = user.username || user.username || "Unknown User";
  const displayName = user.nickname || user.nickname || username;

  const isDeleted = message.deleted;

  if (isDeleted) {
    return (
      <div className="px-4 py-2 opacity-50">
        <div className="flex gap-3">
          <div className="w-10 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-concord-secondary italic border border-border rounded px-3 py-2 bg-concord-tertiary/50">
              This message has been deleted
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="group relative px-4 py-2 hover:bg-concord-secondary/50 transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-3">
          {/* Avatar - always show */}
          <div className="w-10 flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.picture || undefined} alt={username} />
              <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            {/* Reply line and reference */}
            {replyTo && replyToUser && (
              <div className="flex items-center gap-2 mb-2 text-xs text-concord-secondary">
                <div className="w-6 h-3 border-l-2 border-t-2 border-concord-secondary/50 rounded-tl-md ml-2" />
                <span className="font-medium text-concord-primary">
                  {replyToUser.nickname || replyToUser.username}
                </span>
                <span className="truncate max-w-xs opacity-75">
                  {replyTo.text.replace(/```[\s\S]*?```/g, "[code]")}
                </span>
              </div>
            )}

            {/* Header - always show */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-concord-primary">
                {displayName}
              </span>
              <span className="text-xs text-concord-secondary">
                {formatTimestamp(message.createdAt)}
              </span>
              {message.edited && (
                <span className="text-xs text-concord-secondary opacity-60">
                  (edited)
                </span>
              )}
              {(message as any).pinned && (
                <Pin className="h-3 w-3 text-concord-primary" />
              )}
            </div>

            {/* Message content with markdown */}
            <div className="text-concord-primary leading-relaxed prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  code: ({ className, children }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <div className="flex flex-row flex-1 max-w-2/3 flex-wrap !bg-transparent">
                        <SyntaxHighlighter
                          PreTag="div"
                          children={String(children).replace(/\n$/, "")}
                          language={match[1]}
                          style={mode === "light" ? solarizedLight : dark}
                          className="!bg-concord-secondary p-2 border-2 concord-border rounded-xl"
                        />
                      </div>
                    ) : (
                      <code className={className}>{children}</code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 my-2 italic text-concord-secondary bg-concord-secondary/30 py-2 rounded-r">
                      {children}
                    </blockquote>
                  ),
                  p: ({ children }) => (
                    <p className="my-1 text-concord-primary">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-concord-primary">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-concord-primary">{children}</em>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside my-2 text-concord-primary">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside my-2 text-concord-primary">
                      {children}
                    </ol>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold my-2 text-concord-primary">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold my-2 text-concord-primary">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold my-2 text-concord-primary">
                      {children}
                    </h3>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          </div>

          {/* Message actions */}
          {isHovered && (
            <div className="absolute top-0 right-4 bg-concord-secondary border border-border rounded-md shadow-md flex">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 interactive-hover"
                onClick={() => onReply?.(message.id)}
              >
                <Reply className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 interactive-hover"
                onClick={() => navigator.clipboard.writeText(message.text)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {/*<MessageActionsDropdown
                message={message}
                onReply={() => onReply?.(message.id)}
              />*/}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
