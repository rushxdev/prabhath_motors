import { Link, useLocation } from 'react-router-dom';

const EmployeeNavBar = () => {
  const location = useLocation();

  return (
    <nav className='bg-black text-white p-4 flex justify-between'>
      <div className='flex-1'></div>
      <div className='flex space-x-6'>
        <Link
          to="/admin/employee/dashboard"
          className={`hover:text-green-400 transition-colors ${
            location.pathname === '/admin/employee/dashboard' ? 'text-green-400 font-medium' : ''
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/employee/reports"
          className={`hover:text-green-400 transition-colors ${
            location.pathname === '/admin/employee/reports' ? 'text-green-400 font-medium' : ''
          }`}
        >
          Reports
        </Link>
      </div>
    </nav>
  );
};

export default EmployeeNavBar;