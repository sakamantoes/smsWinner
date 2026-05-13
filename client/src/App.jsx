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
import UserDeposits from "./pages/user/UserDeposits.jsx";

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
          <Route path="deposits" element={<UserDeposits />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
