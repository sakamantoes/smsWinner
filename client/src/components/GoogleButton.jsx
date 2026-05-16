import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../service/auth.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../store/useAuth.js";
import { useState } from "react";
import {Loader}  from "lucide-react"

export default function GoogleButton() {
  const navigate = useNavigate();
  const setAuthUser = useAuth((state) => state.setAuthUser);
  const [isLoading, setIsLoading] = useState(false);

  const successfull = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const token = credentialResponse.credential;

      const response = await googleAuth(token);

      if (response.status === 200 || response.status === 201) {
        navigate("/f/dashboard");
        toast.success("Login successful");
      } else {
        toast.error(response.data.message || "Google login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader className="w-7 h-7 text-red animate-spin" />
      ) : (
        <GoogleLogin
          onSuccess={(credentialResponse) => successfull(credentialResponse)}
          onError={() => {
            console.log("Login Failed");
            toast.error("login failed");
          }}
        />
      )}
    </>
  );
}
