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
        </Route>
      </Routes>
    </>
  );
};

export default App;
