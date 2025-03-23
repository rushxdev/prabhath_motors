import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import CustomerDashboard from "./modules/user/pages/CustomerDashboard"
import BookAppointment from "./modules/user/pages/BookAppointment"
import AppointmentPage from "./modules/admin/pages/AppointmentPage"
import AppointmentUpdate from "./modules/admin/pages/AppointmentUpdate"


function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/appointment-list" element={<AppointmentPage />} />
        <Route path="/appointment-list/update-appointment/:id" element={<AppointmentUpdate />} />
      </Routes>
    </Router>
  )
}

export default App
