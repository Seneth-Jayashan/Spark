import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { user, updateProfile, resetPassword, fetchMe } = useAuth();

  const [formData, setFormData] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_phone_number: "",
    user_address: "",
    user_profile_picture: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  // populate form when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        user_first_name: user.user_first_name || "",
        user_last_name: user.user_last_name || "",
        user_email: user.user_email || "",
        user_phone_number: user.user_phone_number || "",
        user_address: user.user_address || "",
        user_profile_picture: null,
      });
      setLogoPreview(user.user_profile_picture ? `${import.meta.env.VITE_SERVER_URL}/uploads/${user.user_profile_picture}` : null);
    }
  }, [user]);

  // handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await updateProfile(data);
      toast.success("✅ Profile updated successfully!");
      fetchMe(); // refresh user info
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("❌ New password and confirm password do not match!");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(user?.resetToken, passwordData.newPassword); // assuming resetToken is available
      Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: "Your password has been updated successfully.",
        confirmButtonColor: "#2563eb",
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6 text-gray-500 animate-pulse">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">My Profile</h2>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-6">
          <label className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-gray-500 text-center">Upload Picture</span>
            )}
            <input type="file" name="user_profile_picture" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="user_first_name"
            value={formData.user_first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="user_last_name"
            value={formData.user_last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <input
          type="email"
          name="user_email"
          value={formData.user_email}
          onChange={handleChange}
          placeholder="Email"
          className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
          required
        />
        <input
          type="text"
          name="user_phone_number"
          value={formData.user_phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
        />
        <input
          type="text"
          name="user_address"
          value={formData.user_address}
          onChange={handleChange}
          placeholder="Address"
          className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-700 transition shadow-md"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Password Change */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            className="p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-xl font-bold text-lg hover:from-green-500 hover:to-green-700 transition shadow-md"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
