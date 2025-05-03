import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AppointmentNavigation: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex space-x-8">
                            <Link
                                to="/admin/appointments"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/admin/appointments')}`}
                            >
                                Appointments
                            </Link>
                            <Link
                                to="/admin/tasks"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/admin/tasks')}`}
                            >
                                Tasks
                            </Link>
                            <Link
                                to="/admin/jobs"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/admin/jobs')}`}
                            >
                                Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AppointmentNavigation; 