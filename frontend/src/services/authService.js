import api from "./api";

// Login
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

// Register
export const registerUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

// Get all roles
export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};