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
//             className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg hover:bg-indigo-50 transition"
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
import toast, { Toaster } from "react-hot-toast";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left: Optional Illustration or placeholder */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="w-64 h-64 rounded-full flex items-center justify-center
            bg-green-100 transition-all duration-500
            hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10
            shadow-md relative"
             style={{ marginLeft: "20%" }} // <-- image thoda right shift
            >
            {/* Optional Illustration */}
            <img src={forgot} alt="Illustration" className="max-w-[150%] max-h-[150%] object-contain" />
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
            Forgot <br /> Password?
          </h2>

          {/* Subtext */}
          <p className="text-xl text-gray-600 mb-8 text-center">
            Enter the email address associated with your account.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
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
              {loading ? "Sending..." : "Next"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-4">
             If you don’t receive the email, check spam or try again.
          </p>
        </div>
      </div>
    </div>
  );
}
