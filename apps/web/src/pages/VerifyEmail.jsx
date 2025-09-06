import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";

const VerifyEmail = () => {
  const { verifyEmail } = useContext(AuthContext);
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmail(token);

        setMessage(res?.message || "Email verified successfully!");
        setLoading(false);

        await Swal.fire({
          title: "Success!",
          text: res?.message || "Your email has been verified successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        navigate("/login");
      } catch (error) {
        console.error("Verification error:", error);
        setMessage(error.message || "Invalid or expired token");
        setLoading(false);

        await Swal.fire({
          title: "Error!",
          text: error.message || "Invalid or expired token. Please request a new verification link.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });

        navigate("/signup");
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
      <div className="shadow-lg rounded-xl p-8 max-w-md w-full text-center bg-white">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">{message}</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
            <p className="text-gray-700">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
