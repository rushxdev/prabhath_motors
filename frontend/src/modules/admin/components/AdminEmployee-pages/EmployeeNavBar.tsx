import { Link } from 'react-router-dom'


const EmployeeNavBar = () => {
  return (
    <nav className='bg-black text-white p-4 flex justify-between'>
        <h1 className='text-xl font-bold'>Prabath Motors</h1>
        <div className='flex space-x-4'>
            <Link to={"/admin/employee/add"} className='hover:underline'>New Employee</Link>
            <Link to={"/admin/employee/getAll"} className='hover:underline'>View Employees</Link>
        </div>
    </nav>
  )
}

export default EmployeeNavBar