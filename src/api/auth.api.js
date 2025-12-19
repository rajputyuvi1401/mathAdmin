import api from "./axiosInstance";



// Delete user by admin
export const deleteUserbyAdmin = (userId) => {
  return api.delete(`/auth/admin/delete-user/${userId}`);
};

// Get all users
export const getAllUsers = () => {
  return api.get("/auth/allUser"); // returns a promise with user data
};