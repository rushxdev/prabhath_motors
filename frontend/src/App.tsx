import { useEffect } from "react";
import { ScrollToTop } from "./utils/scrollToTop.util";
import { Route, BrowserRouter as Router, Routes, Outlet } from "react-router-dom";

import HomePage from "./modules/user/pages/HomePage";
import AboutPage from "./modules/user/pages/AboutPage";
import AdminLayout from "./modules/admin/layout/AdminDashboardLayout";

//Appointment, Tasks routes

import AppointmentPage from "./modules/admin/pages/AdminAppointmentPages/AppointmentPage";
import BookAppointment from "./modules/user/pages/UserAppointmentPages/BookAppointment";
import AppointmentUpdate from "./modules/admin/pages/AdminAppointmentPages/AppointmentUpdate";
import TaskList from "./modules/admin/pages/AdminAppointmentPages/TaskList";
//Items, Stocks, Supplier, Order routes
import AdminItemsManager from "./modules/admin/pages/AdminStockPages/AdminItemsManager";
import AdminStockReqManager from "./modules/admin/pages/AdminStockPages/AdminStockReqManager";
import AdminSupplierManager from "./modules/admin/pages/AdminStockPages/AdminSupplierManager";
import AdminStockOrderManager from "./modules/admin/pages/AdminStockPages/AdminStockOrderManager";
import AdminStockReportsManager from "./modules/admin/pages/AdminStockPages/AdminStockReportsManager";
// Utility routes
import AdminUtilityManager from "./modules/admin/pages/AdminUtilityPages/AdminUtilityManager";
import AdminMonthlyUManager from "./modules/admin/pages/AdminUtilityPages/AdminMonthlyUManager";
// vehicle routes
import VehicleDashboard from "./modules/admin/layout/VehicleLayouts/VehicleDashboard";
import VehicleRegistration from "./modules/user/pages/UserVehiclePages/VehicleRegistration";
import VehicleUpdate from "./modules/admin/pages/AdminVehiclePages/VehicleUpdate";
import UtilityBillForm from "./modules/admin/components/AdminUtility-page/UtilityBillForm";
import VehicleOverview from "./modules/admin/pages/AdminVehiclePages/VehicleOverview";
import VehiclePage from "./modules/admin/pages/AdminVehiclePages/VehiclePage";
//Employee routes
import EmployeeDashboard from "./modules/admin/layout/EmployeeLayouts/EmployeeDashboard";
import EmployeeShow from "./modules/admin/layout/EmployeeLayouts/EmployeeShow";
import EmployeeUpdate from "./modules/admin/layout/EmployeeLayouts/EmployeeUpdate";
import VehicleDetails from "./modules/admin/pages/AdminVehiclePages/VehicleDetails";


//Job routes
import JobForm from "./modules/admin/components/JobForm";
import JobList from "./modules/admin/pages/AdminAppointmentPages/JobList";
import JobDetails from "./modules/admin/pages/AdminAppointmentPages/JobDetails";

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
        {/* --------------------User Routes end-----------------*/}


        {/* --------------------Admin Routes------------------ */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Items, stocks, supplier, order routes */}
          <Route path="items" element={<AdminItemsManager />} />
          <Route path="stock-requests" element={<AdminStockReqManager />} />
          <Route path="supplier-details" element={<AdminSupplierManager />} />
          <Route path="order-stocks" element={<AdminStockOrderManager />} />
          <Route path="stock-reports" element={<AdminStockReportsManager />} />
          {/* vehicle routes */}
          <Route path="vehicle-page" element={<VehicleDashboard><Outlet /></VehicleDashboard>}>
            <Route index element={<VehiclePage />} />
            <Route path="overview" element={<VehicleOverview />} />
            <Route path="vehicle-registration" element={<VehicleRegistration />} />
            <Route path="vehicle-update/:id" element={<VehicleUpdate />} />
            <Route path=":id" element={<VehicleDetails />} />
          </Route>
          {/*utility routes*/}
          <Route path="utility" element={<AdminUtilityManager />} />
          <Route path="monthly-utility" element={<AdminMonthlyUManager />} />
          <Route path="utility/add" element={<UtilityBillForm />} />
          <Route path="utility/edit/:id" element={<UtilityBillForm />} />
          {/* Employee routes */}
          <Route path="employee/add" element={<EmployeeDashboard />} />
          <Route path="employee/getAll" element={<EmployeeShow />} />
          <Route path="employee/update/:id" element={<EmployeeUpdate />} />
          {/*Appointment, Tasks routes*/}
          <Route path="appointment-list" element={<AppointmentPage />} />
          <Route path="appointment-list/book-appointment" element={<BookAppointment />} />
          <Route path="appointment-list/update-appointment/:id" element={<AppointmentUpdate />} />
          {/*Job routes*/}
          <Route path="job-form" element={<JobForm />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="jobs/:id" element={<JobDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
