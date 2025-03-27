import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ScrollToTop } from "./utils/scrollToTop.util";
import HomePage from "./modules/user/pages/HomePage";
import AboutPage from "./modules/user/pages/AboutPage";
import AdminLayout from "./modules/admin/layout/AdminDashboardLayout";
import AppointmentPage from "./modules/user/pages/UserStockPages/AllStocks";
import AdminItemsManager from "./modules/admin/pages/AdminStockPages/AdminItemsManager";
import AdminStockReqManager from "./modules/admin/pages/AdminStockPages/AdminStockReqManager";
import AdminSupplierManager from "./modules/admin/pages/AdminStockPages/AdminSupplierManager";

const App: React.FC = () => {
  useEffect(() => {
    // Always set dark mode as default
    //document.documentElement.classList.add("dark");
  }, []);
  return (
    <Router>
      <ScrollToTop /> {/* utillity to always scroll to top on URL change */}
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/*<Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} /> */}
          <Route path="items" element={<AdminItemsManager />} />
          <Route path="stock-requests" element={<AdminStockReqManager />} />
          <Route path="supplier-details" element={<AdminSupplierManager />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
