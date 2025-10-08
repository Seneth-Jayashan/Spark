import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaUser, 
  FaEdit, 
  FaUpload, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaLock,
  FaSave,
  FaSpinner,
  FaShieldAlt,
  FaUserCircle
} from "react-icons/fa";

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
      setLogoPreview(user.user_profile_picture ? `${import.meta.env.VITE_SERVER_URL}${user.user_profile_picture}` : null);
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
      if (user?.user_id) {
        data.append("userId", user.user_id);
      }

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
      await resetPassword(passwordData.newPassword); 
      Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: "Your password has been updated successfully.",
        confirmButtonColor: "#0B2545", // Using our blue-900
        background: "#ffffff",
        color: "#0B2545"
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaUser className="text-blue-900 text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">My Profile</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your personal information and account settings to keep your profile up to date.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaEdit className="text-blue-900" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Personal Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4">
                  <motion.label 
                    className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-2xl cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-900 overflow-hidden shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Profile Preview" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <div className="text-center p-4">
                        <FaUserCircle className="text-gray-400 text-3xl mb-2 mx-auto" />
                        <span className="text-gray-500 text-sm font-medium">Upload Photo</span>
                      </div>
                    )}
                    <input type="file" name="user_profile_picture" accept="image/*" onChange={handleChange} className="hidden" />
                  </motion.label>
                  <p className="text-gray-600 text-sm text-center">
                    Click to upload a profile picture
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name *</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      name="user_first_name"
                      value={formData.user_first_name}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name *</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      name="user_last_name"
                      value={formData.user_last_name}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="user_phone_number"
                    value={formData.user_phone_number}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Address</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="user_address"
                    value={formData.user_address}
                    onChange={handleChange}
                    placeholder="123 Main Street, City, State"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  />
                </div>

                {/* Update Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Profile
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Password Change */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaShieldAlt className="text-green-700" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Security Settings</h2>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Current Password</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="password"
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">New Password</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="password"
                    placeholder="Enter your new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="password"
                    placeholder="Confirm your new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Change Password
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

       
      </div>
    </div>
  );
}
