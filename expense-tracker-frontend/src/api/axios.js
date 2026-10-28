import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8090/api",
});

// Attaching JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
     const url = error.config?.url;

     // Ignore login failures
     if (url?.includes("/auth/login")) {
      return Promise.reject(error);
     }

    if (error.response && 
      (error.response.status === 401 || 
        error.response.status === 403)) {
      const msg = error.response.data?.error;

      if (msg && msg.includes("Token expired")) {
        alert("Token expired. Please login again.");
      } else if (msg && msg.includes("Invalid token")) {
        alert("Invalid token. Please login again.");
      } else {
        alert("Authentication error. Please login again.");
      }

      // Clear token 
      localStorage.removeItem("jwtToken");

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
