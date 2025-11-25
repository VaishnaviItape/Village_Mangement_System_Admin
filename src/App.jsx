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
export default function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Protected Route
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // ✅ Layout for sidebar + header + content
  const Layout = ({ children }) => (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden bg-orange-50">
        {/* 🔶 light orange background */}
        <Header
          sidebarCollapsed={sideBarCollapsed}
          onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
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
        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

