import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../service/auth.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../store/useAuth.js";

export default function GoogleButton() {
  const navigate = useNavigate();
  const setAuthUser = useAuth((state) => state.setAuthUser);

  const successfull = async (credentialResponse) => {
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
    }
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => successfull(credentialResponse)}
      onError={() => {
        console.log("Login Failed");
        toast.error("login failed");
      }}
    />
  );
}
