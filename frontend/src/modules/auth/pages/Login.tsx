import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import HomeLayout from '../../user/layout/HomeLayout';
import { useAuthRedirect } from '../../../hooks/useAuthRedirect';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // Use the custom hook to handle redirection
    useAuthRedirect('/admin/vehicle-page', '/');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(username, password);
            toast.success('Login successful!');

            // The redirection will be handled by the useAuthRedirect hook
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <HomeLayout>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Login to Your Account</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>


                </div>
            </div>
        </HomeLayout>
    );
};

export default Login;
