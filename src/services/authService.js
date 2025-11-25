import axiosInstance from "./axiosInstance";
import toast from "react-hot-toast";


// 🔹 Forgot Password - Step 1
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/Auth/forgot-password", { email });
    toast.success("OTP sent to your registered email!");
    return response.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to send OTP!");
    throw err;
  }
};

// 🔹 Verify OTP - Step 2
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axiosInstance.post("/Auth/VerifyOtp", { email, otp });
    toast.success("OTP verified successfully!");
    return response.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid or expired OTP!");
    throw err;
  }
};

// 🔹 Resend OTP - optional
export const resendOtp = async (email, phoneNumber) => {
  try {
    const response = await axiosInstance.post("/Auth/ResendOtp", { email, phoneNumber });
    toast.success("OTP resent successfully!");
    return response.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to resend OTP!");
    throw err;
  }
};

// 🔹 Reset Password - Step 3
export const resetPassword = async (email, resetToken, newPassword) => {
  try {
    const response = await axiosInstance.post("/Auth/reset-password", {
      email,
      resetToken,
      newPassword,
    });
    toast.success("Password reset successfully!");
    return response.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to reset password!");
    throw err;
  }
};
export const logout = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Already logged out!");
      return;
    }

    // await axiosInstance.post("/api/auth/logout"); // Removed JSON.stringify(token)

    localStorage.removeItem("authToken");
    toast.success("Logout successful!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Logout failed!");
  }
};

export const authme = () => axiosInstance.get("/api/auth/me");