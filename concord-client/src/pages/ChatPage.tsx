import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Hash, Volume2, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageComponent } from "@/components/message/MessageComponent";
import { useInstanceDetails, useInstanceMembers } from "@/hooks/useServers";
import { useChannelMessages, useLoadMoreMessages } from "@/hooks/useMessages";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { Message } from "@/lib/api-client";
import { MessageInput } from "@/components/message/MessageInput";

const ChatPage: React.FC = () => {
  const { instanceId, channelId } = useParams();
  const navigate = useNavigate();

  const {
    data: instance,
    isLoading: instanceLoading,
    error: instanceError,
  } = useInstanceDetails(instanceId);
  const {
    data: channelMessages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useChannelMessages(channelId);
  const { data: users, isLoading: usersLoading } =
    useInstanceMembers(instanceId);

  // UI state hooks - called unconditionally
  const { toggleMemberList, showMemberList } = useUiStore();
  const { user: currentUser } = useAuthStore();

  // Local state hooks - called unconditionally
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesStartRef = useRef<HTMLDivElement>(null);

  // API mutation hooks - called unconditionally
  const loadMoreMessagesMutation = useLoadMoreMessages(channelId);

  // Memoized values - called unconditionally
  const categories = instance?.categories;

  const currentChannel = React.useMemo(() => {
    return categories
      ?.flatMap((cat) => cat.channels)
      ?.find((ch) => ch.id === channelId);
  }, [categories, channelId]);

  const userHasAccess = React.useMemo(() => {
    if (!currentUser || !instanceId) return false;
    if (currentUser.admin) return true;
    return currentUser.roles.some((role) => role.instanceId === instanceId);
  }, [currentUser, instanceId]);

  const sortedMessages = React.useMemo(() => {
    if (!channelMessages) return [];

    // Sort messages by createdAt timestamp (oldest first, newest last)
    return [...channelMessages].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB; // ascending order (oldest to newest)
    });
  }, [channelMessages]);

  // Effects - called unconditionally
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages]);

  // Event handlers
  const handleLoadMore = React.useCallback(async () => {
    if (!channelMessages || channelMessages.length === 0 || isLoadingMore)
      return;

    setIsLoadingMore(true);
    try {
      const oldestMessage = channelMessages[0];
      await loadMoreMessagesMutation.mutateAsync({
        beforeDate: new Date(oldestMessage.createdAt),
      });
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [channelMessages, isLoadingMore, loadMoreMessagesMutation]);

  const handleReply = React.useCallback(
    (messageId: string) => {
      const message = channelMessages?.find((m) => m.id === messageId);
      if (message) {
        setReplyingTo(message);
      }
    },
    [channelMessages],
  );

  // Handle loading states
  if (instanceLoading || messagesLoading || usersLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-concord-primary">
        <div className="text-center text-concord-secondary">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  // Handle errors and permissions
  if (!userHasAccess) {
    return (
      <div className="flex-1 flex items-center justify-center bg-concord-primary">
        <div className="text-center text-concord-secondary">
          <h2 className="text-xl font-semibold mb-2 text-destructive">
            Access Denied
          </h2>
          <p className="mb-4">You don't have permission to view this server.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (instanceError || messagesError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-concord-primary">
        <div className="text-center text-concord-secondary">
          <h2 className="text-xl font-semibold mb-2 text-destructive">
            Error Loading Chat
          </h2>
          <p className="mb-4">
            {instanceError?.message ||
              messagesError?.message ||
              "Something went wrong"}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Require both instanceId and channelId for chat
  if (!instanceId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-concord-primary">
        <div className="text-center text-concord-secondary">
          <h2 className="text-xl font-semibold mb-2 text-concord-primary">
            No Server Selected
          </h2>
          <p>Select a server from the sidebar to start chatting.</p>
        </div>
      </div>
    );
  } else if (!channelId || !currentChannel) {
    const existingChannelId = categories?.flatMap((cat) => cat.channels)?.[0]
      ?.id; // Get the first channel from the flattened list

    if (existingChannelId) {
      navigate(`/channels/${instanceId}/${existingChannelId}`);
      return null;
    } else {
      return (
        <div className="flex-1 flex items-center justify-center bg-concord-primary">
          <div className="text-center text-concord-secondary">
            <h2 className="text-xl font-semibold mb-2 text-concord-primary">
              No channels exist yet!
            </h2>
            <p>Ask an admin to create a channel</p>
          </div>
        </div>
      );
    }
  }

  const ChannelIcon = currentChannel?.type === "voice" ? Volume2 : Hash;

  return (
    <div className="flex flex-col flex-shrink h-full bg-concord-primary">
      {/* Channel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-concord bg-concord-secondary">
        <div className="flex items-center space-x-2">
          <ChannelIcon size={20} className="text-concord-secondary" />
          <span className="font-semibold text-concord-primary">
            {currentChannel?.name}
          </span>
          {currentChannel?.description && (
            <>
              <div className="w-px h-4 bg-border" />
              <span className="text-sm text-concord-secondary truncate max-w-xs">
                {currentChannel.description}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${showMemberList ? "text-interactive-active bg-concord-tertiary" : "interactive-hover"}`}
            onClick={toggleMemberList}
          >
            <Users size={16} />
          </Button>
          <div className="w-40">
            <Input
              placeholder="Search"
              className="h-8 bg-concord-tertiary border-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Messages Area */}
        <ScrollArea className="flex-1 min-h-0">
          {/* Load More Button */}
          {channelMessages && channelMessages.length > 0 && (
            <div className="flex justify-center py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="text-xs"
              >
                {isLoadingMore ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isLoadingMore ? "Loading..." : "Load older messages"}
              </Button>
            </div>
          )}

          <div ref={messagesStartRef} />

          {/* Welcome Message */}
          <div className="px-4 py-6 border-b border-concord/50 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <ChannelIcon size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-concord-primary">
                  Welcome to #{currentChannel?.name}!
                </h3>
              </div>
            </div>
            {currentChannel?.description && (
              <div className="text-concord-secondary bg-concord-secondary/50 p-3 rounded border-l-4 border-primary">
                {currentChannel.description}
              </div>
            )}
          </div>

          <div className="pb-4">
            {/* Messages */}
            {sortedMessages && sortedMessages.length > 0 ? (
              <div>
                {sortedMessages.map((message) => {
                  console.log(message);
                  const user = users?.find((u) => u.id === message.userId);
                  const replyToMessage = channelMessages?.find(
                    (m) => m.id === message.replies?.repliesToId,
                  );
                  const replyToUser = replyToMessage
                    ? users?.find((u) => u.id === replyToMessage.userId)
                    : undefined;

                  if (!user) return null;

                  return (
                    <MessageComponent
                      key={message.id}
                      message={message}
                      user={user}
                      replyTo={replyToMessage}
                      onReply={handleReply}
                      replyToUser={replyToUser}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-concord-secondary">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        {currentUser && (
          <div className="flex-shrink-0">
            <MessageInput
              channelId={channelId}
              channelName={currentChannel?.name}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              replyingToUser={
                replyingTo
                  ? users?.find((u) => u.id === replyingTo.userId) || null
                  : null
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
