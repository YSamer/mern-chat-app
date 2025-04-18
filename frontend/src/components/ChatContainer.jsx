import React, { useEffect } from "react";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeltons/MessageSkeleton";

const ChatContainer = () => {
  const { currentUser, messages, isMessagesLoading, getMessages } =
    useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    getMessages(currentUser._id);
  }, [currentUser._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === user._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === user._id
                      ? user.avatar || "/avatar.png"
                      : currentUser.avatar || "/avatar.png"
                  }
                  alt={
                    message.senderId === user._id ? user.name : currentUser.name
                  }
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="message-image"
                  className="sm:max-w-[200px] sm:max-h-[200px] rounded-md mb-2"
                />
              )}
              {message.content && <p>{message.content}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
