// // src/pages/Auth/VerifyOtpPage.jsx
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import { ArrowLeft } from "lucide-react";
// import { verifyOtp, resendOtp } from "../../services/authService";

// export default function VerifyOtpPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email || "";
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     if (!otp) return toast.error("Enter OTP");
//     setLoading(true);
//     try {
//       const res = await verifyOtp(email, otp);
//       // if backend returns token or resetToken, pass it to reset page
//       const resetToken = res?.resetToken || otp;
//       toast.success("OTP verified");
//       navigate("/reset-password", { state: { email, resetToken } });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setResending(true);
//     try {
//       await resendOtp(email, ""); // phoneNumber empty if not used
//       toast.success("OTP resent");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 p-6">
//       <Toaster position="top-right" />
//       <div className="w-full max-w-md relative">
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute -left-4 -top-6 text-white bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-full shadow-lg hover:scale-105 transition"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </button>

//         <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
//           <h1 className="text-2xl font-semibold text-white mb-2">Verify OTP</h1>
//           <p className="text-sm text-white/80 mb-6">
//             Enter the OTP sent to <span className="font-medium">{email}</span>
//           </p>

//           <form onSubmit={handleVerify} className="space-y-4">
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="6-digit OTP"
//               className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition"
//               required
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition-all"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>

//           <div className="mt-4 flex items-center justify-between">
//             <button
//               onClick={handleResend}
//               disabled={resending}
//               className="text-sm text-white/80 underline hover:text-white"
//             >
//               {resending ? "Resending..." : "Resend OTP"}
//             </button>

//             <button
//               onClick={() => navigate("/forgot-password")}
//               className="text-sm text-white/80 hover:text-white"
//             >
//               Change email
//             </button>
//           </div>
//         </div>

//         <p className="text-center text-white/60 text-sm mt-4">
//           Tip: Check spam folder if OTP is delayed.
//         </p>
//       </div>
//     </div>
//   );
// }

// src/pages/Auth/VerifyOtpPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { verifyOtp, resendOtp } from "../../services/authService";
import otpIllustration from "../../assets/otp.png"; // Optional illustration

export default function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const resetToken = location.state?.resetToken || "";
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Enter OTP");
        setLoading(true);
        try {
            const res = await verifyOtp(email, otp);
            const token = res?.resetToken || resetToken || otp;
            toast.success("OTP verified");
            navigate("/reset-password", { state: { email, resetToken: token } });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await resendOtp(email, "");
            toast.success("OTP resent");
        } catch (err) {
            console.error(err);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <Toaster position="top-right" />
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl">

                {/* Left: Illustration */}
                <div className="md:w-1/2 flex items-center justify-center p-8">
                    <div
                        className="w-64 h-64 rounded-full flex items-center justify-center
                            bg-green-100 transition-all duration-500
                            hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10
                            shadow-md relative"
                        style={{ marginLeft: "20%" }}
                    >
                        <img
                            src={otpIllustration}
                            alt="OTP Illustration"
                            className="max-w-[150%] max-h-[150%] object-contain rounded-2xl"
                        />
                    </div>
                </div>

                {/* Right: Form */}
                <div className="md:w-1/2 flex flex-col justify-center px-12 py-20 relative">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-6 top-6 text-white 
                            bg-gradient-to-br from-indigo-500 to-violet-600 
                            p-3 rounded-full shadow-lg hover:scale-105 
                            hover:shadow-xl transition-all duration-300 
                            backdrop-blur-sm"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>

                    {/* Heading */}
                    <h2 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-12 text-center md:text-left">
                        Verify OTP
                    </h2>

                    <p className="text-xl text-gray-600 mb-8 text-center">
                        Enter the OTP sent to <span className="font-medium">{email}</span>
                    </p>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="6-digit OTP"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 
                                placeholder-gray-500 focus:outline-none 
                                focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl 
                                bg-gradient-to-r from-indigo-600 to-violet-600 
                                text-white font-medium shadow-lg 
                                hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 
                                hover:text-indigo-700
                                hover:scale-[1.02] active:scale-95 transition-all duration-300"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>

                    {/* Resend & Change Email */}
                    <div className="mt-6 flex items-center justify-between">
                        {/* Resend OTP */}
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="px-4 py-2 rounded-xl 
                                bg-gradient-to-r from-indigo-500 to-purple-500 
                                text-white font-medium shadow-md
                                hover:from-purple-500 hover:to-indigo-500
                                hover:scale-105 active:scale-95
                                transition-all duration-300"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>

                        {/* Change Email */}
                        <button
                            onClick={() => navigate("/forgot-password")}
                           className="px-4 py-2 rounded-xl 
                                bg-gradient-to-r from-indigo-500 to-purple-500 
                                text-white font-medium shadow-md
                                hover:from-purple-500 hover:to-indigo-500
                                hover:scale-105 active:scale-95
                                transition-all duration-300"
                        >
                            <span className="relative z-10">Change Email</span>
                        </button>
                    </div>


                    <p className="text-center text-gray-500 text-sm mt-4">
                        Tip: Check spam folder if OTP is delayed.
                    </p>
                </div>
            </div>
        </div>
    );
}

