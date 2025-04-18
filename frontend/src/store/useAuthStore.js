import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import axiosInstance from "../lib/axios.js";

const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("auth/check-auth");
      if (response.data.success) {
        set({ user: response.data.user });
        get().connectSocket();
      } else {
        set({ user: null });
        get().disconnectSocket();
      }
    } catch (error) {
      console.log("Error in checkAuth", error.message);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("auth/signup", data);
      set({ user: response.data.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("auth/login", data);
      set({ user: response.data.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ user: null });
      get().disconnectSocket();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("auth/update-profile", data);
      set({ user: response.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: (socket) => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const s = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    });
    s.connect();
    set({ socket: s });
    s.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
