// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { forgotPassword } from "../../services/authService.js";
// import { ArrowLeft } from "lucide-react";

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await forgotPassword(email);
//       navigate("/verify-otp", { state: { email } });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 relative">
//       <button
//         onClick={() => navigate(-1)}
//         className="absolute top-6 left-6 text-white flex items-center gap-2"
//       >
//         <ArrowLeft className="w-5 h-5" /> Back
//       </button>

//       <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[90%] max-w-md shadow-lg text-white">
//         <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
//         <p className="text-sm mb-6 text-center opacity-80">
//           Enter your registered email to receive an OTP.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             required
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
//           />
//           <button
//             type="submit"
//             className="w-full bg-white text-emerald-600 font-semibold py-3 rounded-lg hover:bg-indigo-50 transition"
//           >
//             Send OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;




// src/pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { forgotPassword } from "../../services/authService";
import forgot from "../../assets/forgot.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("OTP sent to your email");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="min-h-screen flex relative bg-gray-50 overflow-hidden">
            

            {/* Animated Background Shapes */}
            <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-emerald-300 rounded-full opacity-30 animate-ping-slow"></div>
            <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-stone-400 rounded-full opacity-20 animate-spin-slow"></div>
            <div className="absolute top-[150px] right-[-80px] w-56 h-56 bg-amber-300 rounded-full opacity-20 animate-bounce-slow"></div>

            {/* Left Side Image */}
            <div
                className="hidden md:flex w-1/2 bg-contain bg-no-repeat bg-center relative z-10 transition-transform duration-500 hover:scale-105 rounded-l-2xl overflow-hidden"
                style={{ backgroundImage: `url(${forgot})` }}
            ></div>

            {/* Right Side Form */}
            <div className="flex-1 flex flex-col justify-center items-center z-10 relative p-10">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 transform transition-transform hover:scale-105 relative">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute -top-4 -left-4 text-white bg-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Forgot Password?
                    </h2>

                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Enter the email address associated with your account.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-300"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 mt-2 rounded-xl font-medium hover:bg-indigo-700 transition-all transform active:scale-95 shadow-md"
                        >
                            {loading ? "Sending..." : "Next"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        If you don't receive the email, check spam or try again.
                    </p>
                </div>
            </div>
        </div>
    );
}
