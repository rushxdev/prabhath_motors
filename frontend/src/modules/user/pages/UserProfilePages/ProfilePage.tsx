import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../../../services/userService';

interface profileInfo {
    username: string;
    email: string;
    role: string;
    id: string;
}

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState<profileInfo>({} as profileInfo);

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.User);
        } catch (error) {
            console.error('Error fetching profile info:', error);
        }
    };

    return (
        <div>
            <h1>Profile Information</h1>
            {profileInfo ? (
                <>
                    <p>Username: {profileInfo.username}</p>
                    <p>Email: {profileInfo.email}</p>
                    {profileInfo.role === 'ADMIN' && (
                        <button>
                            Link to <Link to={`/update-user/${profileInfo.id}`}>Update User</Link>
                        </button>
                    )}
                </>
            ) : (
                <p>Loading profile information...</p>
            )}
            <Link to="/admin/user-management">Back to Dashboard</Link>
        </div>
    );
}

export default ProfilePage;