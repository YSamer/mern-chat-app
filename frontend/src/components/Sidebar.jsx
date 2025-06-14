import { Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeltons/SidebarSkeleton";

const Sidebar = () => {
  const { getUsers, users, currentUser, setCurrentUser, isUserLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    if (showOnlineOnly) {
      return onlineUsers.includes(user._id);
    }
    return true;
  });

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <span className="text-sm">Show Online</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setCurrentUser(user)}
            className={`w-full p-3 flex items-center gap-3 
              hover:bg-base-200 transition-colors ${
                currentUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user?.avatar || "/avatar.png"}
                alt={user?.name}
                className="size-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 
                bg-green-500 rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>
            {/* User Info - only on large screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user?.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
