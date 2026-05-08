import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../service/auth.js";

export default function ProtectedRoute({ role }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getAuthUser();
        setUser(res.data);
        setStatus("authenticated");
      } catch {
        setStatus("unauthenticated");
      }
    };

    checkUser();
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
