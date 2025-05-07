import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../../../../services/userService";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token is missing.");
            const response = await UserService.getAllUsers(token);
            setUsers(response.ourUsersList);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (confirmDelete) {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Authentication token is missing.");
                await UserService.deleteUser(userId, token);
                fetchUsers();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div>
            <h2>Users Management Page</h2>
            <button>
                <Link to="/register">Add User</Link>
            </button>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => deleteUser(user._id)}>Delete</button>
                                <button>
                                    <Link to={`/update/${user._id}`}>Update</Link>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagementPage;
