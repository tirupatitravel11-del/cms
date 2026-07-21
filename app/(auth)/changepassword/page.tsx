"use client";
import { Context } from "@/contextApi/AuthContext";
import { contextType } from "@/contextApi/CreateDataContext";
import axios from "axios";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const { state, boundActions } = useContext<contextType>(Context);
  const { updateUserData } = boundActions;
  const pathName = usePathname();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.userData?._id) {
      updateUserData({ router, pathName });
    }
  }, []);

  const checkPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (score === 3)
      return { label: "Medium", color: "bg-yellow-500", width: "66%" };

    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = checkPasswordStrength(newPassword);

  const handleUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        process.env.apiUrl + `/api/change-password`,
        {
          oldPassword: currentPassword,
          newPassword,
          userId: state?.userData?._id,
        },
        { withCredentials: true },
      );

      toast.success("Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-left flex bg-white p-2 border-gray-300 border rounded-md my-2 mx-auto">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <LockKeyhole className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 m-0 p-0">
          Change Password
        </h1>
      </div>

      <div className="max-w-xl mx-auto mt-20">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6">
          {/* Current Password */}
          <div>
            <label className="text-base text-gray-700 font-semibold block mb-2">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="text-lg text-black w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-base text-gray-700 font-semibold block mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {newPassword && (
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`${strength.color} h-2 rounded`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Strength: {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-base text-gray-700 font-semibold block mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Confirm password"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {confirmPassword && (
              <p
                className={`text-xs mt-1 ${
                  newPassword === confirmPassword
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {newPassword === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition
            ${
              loading
                ? "bg-blue-500 opacity-50 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </>
  );
};

export default page;
