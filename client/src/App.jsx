import { Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import PaymentStatus from "./pages/PaymentStatus.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import FundAccount from "./pages/user/FundAccount.jsx";
import PhoneNumber from "./pages/user/PhoneNumber.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLayout from "./layouts/UserLayout.jsx";
import Logs from "./pages/user/Logs.jsx";
import OtpBox from "./pages/user/OtpBox.jsx";
import Deposit from "./pages/user/Deposit.jsx";
import Wallet from "./pages/user/Wallet.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import Users from "./pages/admin/Users.jsx";
import Transactions from "./pages/admin/Transactions.jsx";
import AdminNumbers from './pages/admin/AdminNumbers.jsx'
import AdminLogs from "./pages/admin/AdminLogs.jsx"; 
import Reports from "./pages/admin/Reports.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import Setting from "./pages/user/Setting.jsx";

const App = () => {
  return (
    <>
      <ToastContainer position="bottom-right" theme="colored" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment/status" element={<PaymentStatus />} />

        <Route
          path="/f"
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/f/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fund-account" element={<FundAccount />} />
          <Route path="numbers" element={<PhoneNumber />} />
          <Route path="logs" element={<Logs />} />
          <Route path="otp-box" element={<OtpBox />} />
          <Route path="deposits" element={<Deposit />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="settings" element={<Setting />} />
        </Route>

        <Route
          path="/a"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/a/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<Users />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="numbers" element={<AdminNumbers />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;