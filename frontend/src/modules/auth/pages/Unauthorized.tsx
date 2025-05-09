import React from 'react';
import { Link } from 'react-router-dom';
import HomeLayout from '../../user/layout/HomeLayout';

const Unauthorized: React.FC = () => {
    return (
        <HomeLayout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 text-center bg-white rounded-lg shadow-md">
                    <div className="text-red-600 text-6xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
                    
                    <p className="text-gray-600">
                        You don't have permission to access this page. This area is restricted to authorized personnel only.
                    </p>
                    
                    <div className="pt-6">
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
};

export default Unauthorized;
