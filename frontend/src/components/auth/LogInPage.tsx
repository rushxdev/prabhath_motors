import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../../services/userService";

function LogInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await UserService.login(email, password);
            if (userData.token) {
                localStorage.setItem("token", userData.token);
                localStorage.setItem("role", userData.role);
                navigate("/profile");
            }
            else{
                setError("Invalid email or password");
            }
        } catch (error) {
            setError("Invalid email or password");
            console.log(error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return(
        <div>
            <h2>LogIn</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                </div>
                <div>
                    <label>Email: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default LogInPage;