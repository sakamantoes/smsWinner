import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../service/auth.js";
import useAuth from "../store/useAuth.js";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin" /> <p>Getting you set up...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}
