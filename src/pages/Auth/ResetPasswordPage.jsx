// import React, { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import axiosInstance from "../../services/axiosInstance";

// export default function ResetPasswordPage() {
//   const [form, setForm] = useState({
//     email: "",
//     resetToken: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (form.newPassword !== form.confirmPassword) {
//       toast.error("New Password and Confirm Password must match!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axiosInstance.post("/Auth/reset-password", {
//         email: form.email,
//         resetToken: form.resetToken,
//         newPassword: form.newPassword,
//       });
//       toast.success("Password reset successfully!");
//       setForm({
//         email: "",
//         resetToken: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || "Failed to reset password. Please try again.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6">
//       <Toaster position="top-right" />
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           Reset Password
//         </h2>

//         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//           <div className="flex flex-col">
//             <label className="mb-1 font-semibold text-gray-600">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 font-semibold text-gray-600">Reset Token</label>
//             <input
//               type="text"
//               name="resetToken"
//               value={form.resetToken}
//               onChange={handleChange}
//               placeholder="Enter reset token"
//               className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 font-semibold text-gray-600">New Password</label>
//             <input
//               type="password"
//               name="newPassword"
//               value={form.newPassword}
//               onChange={handleChange}
//               placeholder="Enter new password"
//               className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 font-semibold text-gray-600">Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={form.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm new password"
//               className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>

//         <p className="text-sm text-gray-500 mt-4 text-center">
//           Make sure your new password is strong and secure.
//         </p>
//       </div>
//     </div>
//   );
// }

// src/pages/Auth/ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../services/authService";
import resetIllustration from "../../assets/reset.png"; // optional illustration

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    if (!newPassword && !confirmPassword) setMatch(null);
    else setMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("Fill both fields");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await resetPassword(email, resetToken, newPassword);
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        
        {/* Left Illustration */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="w-64 h-64 rounded-2xl flex items-center justify-center
                          bg-white/10 backdrop-blur-sm shadow-lg transition-transform 
                          duration-500 hover:scale-105 overflow-hidden">
            <img
              src={resetIllustration}
              alt="Reset Illustration"
              className="max-w-[90%] max-h-[90%] object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 flex flex-col justify-center px-12 py-20 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 top-6 text-white 
                       bg-gradient-to-br from-indigo-500 to-violet-600 
                       p-3 rounded-full shadow-lg hover:scale-105 
                       hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Heading */}
          <h2 className="text-6xl font-bold bg-clip-text text-transparent 
                         bg-gradient-to-r from-blue-400 to-purple-400 mb-6 text-center md:text-left">
            Reset <br /> Password?
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-center md:text-left">
            Set a new password for <span className="font-medium">{email}</span>
          </p>

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-6">
            <div className="relative">
              <input
                type={show.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                className="absolute right-3 top-3 text-gray-600"
              >
                {show.new ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="relative">
              <input
                type={show.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={`w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500
                  focus:outline-none focus:ring-2 transition pr-10 ${
                    match === null
                      ? "focus:ring-indigo-400"
                      : match
                      ? "ring-2 ring-emerald-400"
                      : "ring-2 ring-red-400"
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute right-3 top-3 text-gray-600"
              >
                {show.confirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {match === false && (
              <p className="text-red-400 text-sm -mt-2">Passwords do not match</p>
            )}
            {match === true && (
              <p className="text-emerald-400 text-sm -mt-2">Passwords match</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600
                         text-white font-medium shadow-lg hover:scale-[1.02] active:scale-95
                         transition-all duration-300"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-4">
            After reset you will be redirected to login.
          </p>
        </div>
      </div>
    </div>
  );
}
