import Navbar from "../../components/Navbar"


const CustomerDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="p-6 text-center ">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-600">Manage your appointments easily</p>
      </div>
    </div>
  )
}

export default CustomerDashboard
