import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../../../services/userService";

interface UserData {
    name: string;
    email: string;
    role: string;
}

function UpdateUser() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData>({
        name: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        if (id) {
            fetchUserDataById(id);
        }
    }, [id]);

    const fetchUserDataById = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token is missing.");
            }
            const response = await UserService.getUserById(id, token);
            const { name, email, role } = response.Users;
            setUserData({ name, email, role });
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to fetch user data. Please try again.");
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (confirmDelete) {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token is missing.");
                }
                await UserService.updateUser(id!, userData, token);
                navigate("/admin/user-management");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user. Please try again.");
        }
    };

    return (
        <div>
            <h2>Update User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateUser;