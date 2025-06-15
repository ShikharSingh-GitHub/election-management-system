import axios from "axios";

const API_URL = "http://localhost:5173/api/auth"; //In future, remove the localhost hardcoding using relative links

export const signup = async (data) => {
  return await axios.post(`${API_URL}/signup`, data);
};

export const login = async (credentials) => {
  return await axios.post(`${API_URL}/login`, credentials);
};
