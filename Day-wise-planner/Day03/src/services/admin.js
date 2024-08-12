import { CreateUser, DeleteUserByID, getAllUsers } from "./api"



const getAllUsersData = async () => {
    const res = await getAllUsers()
    return res?.data;

}
const deleteUser = async (uid) => {
    const res = await DeleteUserByID(uid);
    return res?.data;
}
const addUser = async (name, email,role, phone, address, password) => {
    const res = await CreateUser(name, email, role, phone, address, password);
    return res?.data;
}

export const Admin = { getAllUsersData, deleteUser,addUser }