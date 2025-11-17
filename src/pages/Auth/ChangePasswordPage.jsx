import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../services/axiosInstance";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [matchStatus, setMatchStatus] = useState(null);

  // Live validation for password match
  useEffect(() => {
    if (form.newPassword && form.confirmPassword) {
      setMatchStatus(form.newPassword === form.confirmPassword);
    } else {
      setMatchStatus(null);
    }
  }, [form.newPassword, form.confirmPassword]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New Password and Confirm Password must match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/Auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("✅ Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        "⚠️ Failed to change password. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6">
      <Toaster position="top-right" />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-bahnschrift">
          Change Password 🔐
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="flex flex-col relative">
            <label className="mb-1 font-semibold text-gray-600">
              Current Password
            </label>
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((p) => ({ ...p, current: !p.current }))
              }
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="flex flex-col relative">
            <label className="mb-1 font-semibold text-gray-600">
              New Password
            </label>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((p) => ({ ...p, new: !p.new }))
              }
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col relative">
            <label className="mb-1 font-semibold text-gray-600">
              Confirm New Password
            </label>
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className={`border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:border-transparent ${
                matchStatus === false
                  ? "border-red-400 focus:ring-red-400"
                  : matchStatus === true
                  ? "border-emerald-400 focus:ring-emerald-400"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((p) => ({ ...p, confirm: !p.confirm }))
              }
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {matchStatus !== null && (
              <p
                className={`mt-1 text-sm ${
                  matchStatus ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {matchStatus
                  ? "✅ Passwords match"
                  : "⚠️ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Make sure your new password is strong and secure.
        </p>
      </div>
    </div>
  );
}
