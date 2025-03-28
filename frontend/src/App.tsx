import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CustomerDashboard from "./modules/user/pages/CustomerDashboard";
import BookAppointment from "./modules/user/pages/BookAppointment";
import AppointmentPage from "./modules/admin/pages/AppointmentPage";
import AppointmentUpdate from "./modules/admin/pages/AppointmentUpdate";
import React, { useEffect } from "react";
import { ScrollToTop } from "./utils/scrollToTop.util";
import HomePage from "./modules/user/pages/HomePage";
import AboutPage from "./modules/user/pages/AboutPage";
import AdminLayout from "./modules/admin/layout/AdminDashboardLayout";
// import AppointmentPage from "./modules/user/pages/UserStockPages/AllStocks";
import AdminItemsManager from "./modules/admin/pages/AdminStockPages/AdminItemsManager";
import AdminStockReqManager from "./modules/admin/pages/AdminStockPages/AdminStockReqManager";
import AdminSupplierManager from "./modules/admin/pages/AdminStockPages/AdminSupplierManager";
import AdminStockOrderManager from "./modules/admin/pages/AdminStockPages/AdminStockOrderManager";

// Utility routes
import AdminUtilityManager from "./modules/admin/pages/AdminUtilityPages/AdminUtilityManager";
import AdminMonthlyUManager from "./modules/admin/pages/AdminUtilityPages/AdminMonthlyUManager";
//Utilityform
import UtilityBillForm from "./modules/admin/components/AdminUtility-page/UtilityBillForm";

function App() {
  useEffect(() => {
    // Always set dark mode as default
    //document.documentElement.classList.add("dark");
  }, []);
  return (
    <Router>
      <ScrollToTop /> {/* utillity to always scroll to top on URL change */}
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/appointment-list" element={<AppointmentPage />} />
        <Route
          path="/appointment-list/update-appointment/:id"
          element={<AppointmentUpdate />}
        />
        {/* User Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        {/*<Route path="/appointment" element={<AppointmentPage />} />*/}

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/*<Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} /> */}
          <Route path="items" element={<AdminItemsManager />} />
          <Route path="stock-requests" element={<AdminStockReqManager />} />
          <Route path="supplier-details" element={<AdminSupplierManager />} />
          <Route path="order-stocks" element={<AdminStockOrderManager />} />

          {/*utility routes*/}
          <Route path="utility" element={<AdminUtilityManager />} />
          <Route path="monthly-utility" element={<AdminMonthlyUManager />} />
          {/*utility routes- for the form*/}
          <Route path="utility/add" element={<UtilityBillForm />} />
          <Route path="utility/edit/:id" element={<UtilityBillForm />} />

          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
