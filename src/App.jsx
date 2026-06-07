// import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "./components/Layout/Sidebar";
// import Header from "./components/Layout/Header";
// import LoginPage from "./pages/LoginPage";
// import Dashboard from "./components/Dashboard/Dashboard";
// import StateTable from "./pages/StateTable";
// import DistrictTable from "./pages/DistrictTable";
// import SubscriptionPlanTable from "./pages/SubscriptionPlanTable";
// import ClientsPage from "./pages/ClientsPage";

// export default function App() {
//   const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   const ProtectedRoute = ({ children }) => {
//     if (!isLoggedIn) {
//       return <Navigate to="/login" replace />;
//     }
//     return children;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public Route */}
//         <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />

//         {/* Protected Routes */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <div className="flex h-screen overflow-hidden">
//                 <Sidebar
//                   collapsed={sideBarCollapsed}
//                   onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
//                 />
//                 <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
//                   {/* ✅ light orange background */}
//                   <Header
//                     sidebarCollapsed={sideBarCollapsed}
//                     onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
//                   />

//                   <main className="flex-1 overflow-y-auto">
//                     <div className="p-6 space-y-6">
//                       <Routes>
//                         <Route path="dashboard" element={<Dashboard />} />
//                         <Route path="state" element={<StateTable />} />
//                         <Route path="district" element={<DistrictTable />} />
//                         <Route path="subscription" element={<SubscriptionPlanTable />} />
//                         <Route path="all-clients" element={<ClientsPage />} />
//                         <Route path="*" element={<Dashboard />} />
//                         {/* Expansion Modules */}
//                         <Route path="/sv/health" element={<HealthSanitation />} />
//                         <Route path="/sv/marketplace" element={<MarketplaceAdmin />} />
//                         <Route path="/sv/payments" element={<PaymentsAdmin />} />
//                         <Route path="/sv/audit" element={<AuditReports />} />
//                       </Routes>
//                     </div>
//                   </main>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* Default redirect */}
//         <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
//       </Routes>
//     </Router>
//   );
// }

//-----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard/Dashboard";
import StateTable from "./pages/StateTable";
import DistrictTable from "./pages/DistrictTable";
import SubscriptionPlanTable from "./pages/SubscriptionPlanTable";
import ProfilePage from "./pages/ProfilePage";
import VerifyOtpPage from "./pages/Auth/VerifyOtpPage.jsx";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import ChangePasswordPage from "./pages/Auth/ChangePasswordPage.jsx";
import MyMessages from "./pages/MyMessages.jsx"
import VillagePage from "./pages/VillagePage.jsx";
import Users from "./pages/users.jsx";
import ApplicationPage from "./pages/ApplicationPage.jsx";
import CitizenPage from "./pages/CitizenPage.jsx";
import ComplaintPage from "./pages/ComplaintPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import PropertyPage from "./pages/PropertyPage.jsx";
import SchemeApplicationsPage from "./pages/SchemeApplicationsPage.jsx";
import Schemes from "./pages/Schemes.jsx";
import TaxPage from "./pages/TaxPage.jsx";
import ChatBot from "./pages/ChatBot.jsx";
import TalukaPage from "./pages/TalukaPage.jsx";
import PanchayatMembersPage from "./pages/PanchayatMembersPage.jsx";
import InfrastructurePage from "./pages/InfrastructurePage.jsx";
import TaxReportPage from "./pages/Reports/TaxReportPage.jsx";
import ComplaintReportPage from "./pages/Reports/ComplaintReportPage.jsx";
import UserReportPage from "./pages/Reports/UserReportPage.jsx";
import CivicRegistrationsPage from "./pages/CivicRegistrationsPage.jsx";
import UtilityRequestsPage from "./pages/UtilityRequestsPage.jsx";
import TradeLicensesPage from "./pages/SmartVillage/TradeLicensesPage.jsx";
import VendorManagementPage from "./pages/SmartVillage/VendorManagementPage.jsx";
import GramSabhaPage from "./pages/SmartVillage/GramSabhaPage.jsx";
import ExpensesPage from "./pages/SmartVillage/ExpensesPage.jsx";
import AssetMaintenancePage from "./pages/SmartVillage/AssetMaintenancePage.jsx";
import LandRegistrationsPage from "./pages/SmartVillage/LandRegistrationsPage.jsx";

// Expansion Modules
import HealthSanitation from "./pages/Expansion/HealthSanitation";
import MarketplaceAdmin from "./pages/Expansion/MarketplaceAdmin";
import PaymentsAdmin from "./pages/Expansion/PaymentsAdmin";
import AuditReports from "./pages/Expansion/AuditReports";
export default function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Protected Route with RBAC
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    try {
      // Decode JWT payload to get user role
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role === "villager") {
        // Villagers are not allowed in the Admin Panel
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-red-50">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-700 mb-6">Villagers cannot access the Admin Panel. Please use the Mobile App.</p>
            <button onClick={() => { localStorage.removeItem("authToken"); window.location.href='/login'; }} className="bg-red-600 text-white px-6 py-2 rounded">Logout</button>
          </div>
        );
      }
    } catch (e) {
      console.error("Token decode error", e);
    }

    return children;
  };

  // ✅ Layout for sidebar + header + content
  const Layout = ({ children }) => (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarCollapsed={sideBarCollapsed}
          onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
        />
        <main 
          className="flex-1 overflow-y-auto relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
            main::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/village"
          element={
            <ProtectedRoute>
              <Layout>
                <VillagePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/state"
          element={
            <ProtectedRoute>
              <Layout>
                <StateTable />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/district"
          element={
            <ProtectedRoute>
              <Layout>
                <DistrictTable />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/state"
          element={
            <ProtectedRoute>
              <Layout>
                <StateTable />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/district"
          element={
            <ProtectedRoute>
              <Layout>
                <DistrictTable />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/taluka"
          element={
            <ProtectedRoute>
              <Layout>
                <TalukaPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/panchayat-members"
          element={
            <ProtectedRoute>
              <Layout>
                <PanchayatMembersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/infrastructure"
          element={
            <ProtectedRoute>
              <Layout>
                <InfrastructurePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Layout>
                <SubscriptionPlanTable />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mymessages"
          element={
            <ProtectedRoute>
              <Layout>
                <MyMessages />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                < Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <Layout>
                <ChangePasswordPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Layout>
                <ApplicationPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen"
          element={
            <ProtectedRoute>
              <Layout>
                <CitizenPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Layout>
                <ComplaintPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/property"
          element={
            <ProtectedRoute>
              <Layout>
                <PropertyPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/schemeaplications"
          element={
            <ProtectedRoute>
              <Layout>
                <SchemeApplicationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheme"
          element={
            <ProtectedRoute>
              <Layout>
                <Schemes />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tax"
          element={
            <ProtectedRoute>
              <Layout>
                <TaxPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Layout>
                <ChatBot />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/taxes"
          element={
            <ProtectedRoute>
              <Layout>
                <TaxReportPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/complaints"
          element={
            <ProtectedRoute>
              <Layout>
                <ComplaintReportPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserReportPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/civic-registrations"
          element={
            <ProtectedRoute>
              <Layout>
                <CivicRegistrationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/utility-requests"
          element={
            <ProtectedRoute>
              <Layout>
                <UtilityRequestsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/sv/trade" element={<ProtectedRoute><Layout><TradeLicensesPage /></Layout></ProtectedRoute>} />
        <Route path="/sv/vendors" element={<ProtectedRoute><Layout><VendorManagementPage /></Layout></ProtectedRoute>} />
        <Route path="/sv/sabha" element={<ProtectedRoute><Layout><GramSabhaPage /></Layout></ProtectedRoute>} />
        <Route path="/sv/expenses" element={<ProtectedRoute><Layout><ExpensesPage /></Layout></ProtectedRoute>} />
        <Route path="/sv/maintenance" element={<ProtectedRoute><Layout><AssetMaintenancePage /></Layout></ProtectedRoute>} />
        <Route path="/sv/land" element={<ProtectedRoute><Layout><LandRegistrationsPage /></Layout></ProtectedRoute>} />

        {/* Expansion Modules */}
        <Route path="/sv/health" element={<ProtectedRoute><Layout><HealthSanitation /></Layout></ProtectedRoute>} />
        <Route path="/sv/marketplace" element={<ProtectedRoute><Layout><MarketplaceAdmin /></Layout></ProtectedRoute>} />
        <Route path="/sv/payments" element={<ProtectedRoute><Layout><PaymentsAdmin /></Layout></ProtectedRoute>} />
        <Route path="/sv/audit" element={<ProtectedRoute><Layout><AuditReports /></Layout></ProtectedRoute>} />
        
        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

