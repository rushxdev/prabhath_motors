import { useEffect } from "react";
import { ScrollToTop } from "./utils/scrollToTop.util";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import HomePage from "./modules/user/pages/HomePage";
import AboutPage from "./modules/user/pages/AboutPage";
import AdminLayout from "./modules/admin/layout/AdminDashboardLayout";

//Appointment routes
import CustomerDashboard from "./modules/user/pages/UserAppointmentPages/CustomerDashboard";
import BookAppointment from "./modules/user/pages/UserAppointmentPages/BookAppointment";
import AppointmentPage from "./modules/admin/pages/AdminAppointmemtPages/AppointmentPage";
import AppointmentUpdate from "./modules/admin/pages/AdminAppointmemtPages/AppointmentUpdate";
/*import AppointmentDashboard from "./pages/AppointmentDashboard";
import AppointmentPage from "./modules/admin/pages/AppointmentPage";*/
//Items, Stocks, Supplier, Order routes
import AdminItemsManager from "./modules/admin/pages/AdminStockPages/AdminItemsManager";
import AdminStockReqManager from "./modules/admin/pages/AdminStockPages/AdminStockReqManager";
import AdminSupplierManager from "./modules/admin/pages/AdminStockPages/AdminSupplierManager";
import AdminStockOrderManager from "./modules/admin/pages/AdminStockPages/AdminStockOrderManager";
// Utility routes
import AdminUtilityManager from "./modules/admin/pages/AdminUtilityPages/AdminUtilityManager";
import AdminMonthlyUManager from "./modules/admin/pages/AdminUtilityPages/AdminMonthlyUManager";
import VehicleRegistration from "./modules/user/pages/UserVehiclePages/VehicleRegistration";
import VehiclePage from "./modules/admin/pages/AdminVehiclePages/VehiclePage"
import VehicleUpdate from "./modules/admin/pages/AdminVehiclePages/VehicleUpdate";
import UtilityBillForm from "./modules/admin/components/AdminUtility-page/UtilityBillForm";//Utilityform
//Employee routes
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeShow from "./pages/EmployeeShow";
import EmployeeUpdate from "./pages/EmployeeUpdate";

function App() {
  useEffect(() => {
    // Always set dark mode as default
    //document.documentElement.classList.add("dark");
  }, []);
  return (

    <Router>
       
      <ScrollToTop /> {/* utillity to always scroll to top on URL change */}

      <Routes>
        {/* --------------------User Routes-------------------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          {/*Vehicle routes*/}
            <Route path="vehicle-registration" element={<VehicleRegistration />} />
            <Route path="vehicle-page" element={<VehiclePage />} />
            <Route path="vehicle-page/vehicle-update/:id" element={<VehicleUpdate />} />
          {/*Appointment routes*/}
          <Route path="/" element={<CustomerDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/appointment-list" element={<AppointmentPage />} />
          <Route path="/appointment-list/update-appointment/:id" element={<AppointmentUpdate />} />

        {/* --------------------Admin Routes------------------ */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Items, stocks, supplier, order routes */}
          <Route path="items" element={<AdminItemsManager />} />
          <Route path="stock-requests" element={<AdminStockReqManager />} />
          <Route path="supplier-details" element={<AdminSupplierManager />} />
          <Route path="order-stocks" element={<AdminStockOrderManager />} />
          {/*utility routes*/}
          <Route path="utility" element={<AdminUtilityManager />} />
          <Route path="monthly-utility" element={<AdminMonthlyUManager />} />
          <Route path="utility/add" element={<UtilityBillForm />} />
          <Route path="utility/edit/:id" element={<UtilityBillForm />} />
          {/* Employee routes */}
          <Route path="employee/add" element={<EmployeeDashboard />} />
          <Route path="employee/getAll" element={<EmployeeShow />} />
          <Route path="employee/update/:id" element={<EmployeeUpdate />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
