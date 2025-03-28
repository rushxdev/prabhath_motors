import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='bg-black text-white p-4 flex justify-between'>
        <h1 className='text-xl font-bold'>Prabath Motors</h1>
        <div className='space-x-4'>
            <Link to={"/appointment"} className='hover:underline'>Book Appointment</Link>
            <Link to={"/my-appointments"} className='hover:underline'>My Appointments</Link>
            <Link to={"/appointment-list"} className='hover:underline'>Appointments</Link>
        </div>
    </nav>
  )
}

export default Navbar
