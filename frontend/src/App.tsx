import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import CustomerDashboard from "./pages/CustomerDashboard"
import BookAppointment from "./pages/BookAppointment"


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
