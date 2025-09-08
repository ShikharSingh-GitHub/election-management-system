import axios from "axios";

const API_URL = "http://localhost:5173/api/auth";

// Signup API call
export const signup = async (data) => {
  return await axios.post(`${API_URL}/signup`, data);
};

// Login API call
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);

  const user = response.data.user;
  // Store in localStorage
  if (user?.id) {
    localStorage.setItem("id", user.id);
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("userEmail", user.email || "");
    //localStorage.setItem("userType", user.userType || "voter");
  }

  return response;
};

// Logout utility
export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();

  if ("caches" in window) {
    caches.keys().then((names) => {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
};

// Get current user utility
export const getCurrentUser = () => {
  return {
    id: localStorage.getItem("id"),
    name: localStorage.getItem("userName"),
    userType: localStorage.getItem("userType"),
  };
};
