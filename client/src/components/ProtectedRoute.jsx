import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../service/auth.js";
import useAuth from "../store/useAuth.js";

export default function ProtectedRoute({ role, children }) {
  const { user, status, setStatus, setAuthUser, clearAuth } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      setStatus("checking");
      try {
        const res = await getAuthUser();

        if (res.status === 200 || res.status === 201) {
          setAuthUser(res.data);
          return;
        }

        clearAuth();
      } catch (error) {
        console.error("fetching user data: ", error);
        clearAuth();
      }
    };

    checkUser();
  }, [clearAuth, setAuthUser, setStatus]);

  if (status === "checking") {
    return null;
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}
