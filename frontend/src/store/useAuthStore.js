import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("auth/check-auth");
      if (response.data.success) {
        set({ user: response.data.user });
      } else {
        set({ user: null });
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
}));
