import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import CustomerDashboard from "./modules/user/pages/CustomerDashboard"
import BookAppointment from "./modules/user/pages/BookAppointment"


function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </Router>
  )
}

export default App
