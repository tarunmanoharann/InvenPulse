import { getAllUsers, deleteUser as apiDeleteUser, createUser as apiCreateUser } from "./api";

const Admin = {
    // Fetch all users
    getAllUsersData: async () => {
        try {
            const response = await getAllUsers();
            return response.data;
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    },

    // Delete a user by ID
    deleteUser: async (uid) => {
        try {
            const response = await apiDeleteUser(uid);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // Add a new user
    addUser: async (name, email, role, phone, address, password) => {
        try {
            const response = await apiCreateUser(name, email, role, phone, address, password);
            return response.data;
        } catch (error) {
            console.error("Error adding user:", error);
            throw error;
        }
    },

    // You can add more admin-specific functions here
};

export default Admin;