import { toast } from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  currentUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await axiosInstance.get("messages/users");

      set({
        users: response.data?.filteredUsers || [],
        isUserLoading: false,
      });
    } catch (error) {
      toast.error(error.response.data?.message || "Failed to get users");
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`messages/${userId}`);
      set({
        messages: response.data?.messages || [],
        isMessagesLoading: false,
      });
    } catch (error) {
      toast.error(error.response.data?.message || "Failed to get messages");
      set({ isMessagesLoading: false });
    }
  },
  setCurrentUser: (currentUser) => set({ currentUser }),
  setIsUserLoading: (isUserLoading) => set({ isUserLoading }),
  setIsMessagesLoading: (isMessagesLoading) => set({ isMessagesLoading }),
  sendMessage: async (message) => {
    console.log(message);
    const { currentUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `messages/send/${currentUser._id}`,
        message
      );
      console.log(response.data?.newMessage);
      set({ messages: [...messages, response.data?.newMessage] });
    } catch (error) {
      toast.error(error.response.data?.message || "Failed to send message");
    }
  },
  subscribeToMessages: (message) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // TODO: Handle
    socket.on("newMessage", (message) => {
      const isCurrentUserMessage = message.senderId === currentUser._id;
      if (!isCurrentUserMessage) return;
      set({
        messages: [...get().messages, message],
      });
    });
  },
  unsubscribeFromMessages: () => {
    // const { currentUser } = get();
    // if (!currentUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));
