import UserService from "../../services/userService";

function autheticateUser(){
    const isAuhenticated = UserService.isAuthenticated();

    const handleLogout = () => {
        const confirmation = window.confirm("Are you sure you want to log out?");
        if (confirmation) {
            UserService.logout();
            window.location.href = "/login";  
        }
    };

    return (
        <div>
            <h2>Logout</h2>
            {isAuhenticated && <button onClick={handleLogout}>Log Out</button>}
        </div>
    );
}

export default autheticateUser;

