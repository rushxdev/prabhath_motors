import { Link, useLocation } from 'react-router-dom';

const EmployeeNavBar = () => {
  const location = useLocation();

  return (
    <nav className='bg-gray-800 text-white p-4 flex justify-between'>
      <h1 className='text-xl font-bold'>Prabath Motors</h1>
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
          to="/admin/employee/add"
          className={`hover:text-green-400 transition-colors ${
            location.pathname === '/admin/employee/add' ? 'text-green-400 font-medium' : ''
          }`}
        >
          Add Employee
        </Link>
        <Link
          to="/admin/employee/getAll"
          className={`hover:text-green-400 transition-colors ${
            location.pathname === '/admin/employee/getAll' ? 'text-green-400 font-medium' : ''
          }`}
        >
          View Employees
        </Link>
      </div>
    </nav>
  );
};

export default EmployeeNavBar;