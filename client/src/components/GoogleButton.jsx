import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../service/auth.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function GoogleButton() {
  const navigate = useNavigate();

  const successfull = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      await googleAuth(token);

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Google login failed");
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
