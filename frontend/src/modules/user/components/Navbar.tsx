

const Navbar = () => {
  return (
    <nav className='bg-black text-white p-4 flex justify-between'>
        <h1 className='text-xl font-bold'>Prabath Motors</h1>
        <div className='space-x-4'>
            {/* <Link to={"/book-appointment"} className='hover:underline'>Book Appointment</Link>
            <Link to={"/my-appointments"} className='hover:underline'>My Appointments</Link>
            <Link to={"/appointment-list"} className='hover:underline'>Appointments</Link>
            <Link to={"/vehicle-registration"} className='hover:underline'>Vehicle Registration</Link>
            <Link to={"/vehicle-page"} className='hover:underline'>Vehicle List</Link> */}

            {/* <Link to={"/appointment"} className='hover:underline'>Book Appointment</Link>
            <Link to={"/my-appointments"} className='hover:underline'>My Appointments</Link>
            <Link to={"/appointment-list"} className='hover:underline'>Appointments</Link> */}
        </div>
    </nav>
  )
}

export default Navbar
