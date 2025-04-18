import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? import.meta.env.VITE_BACKEND_LOCAL_API_URL
      : import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
});

export default axiosInstance;
