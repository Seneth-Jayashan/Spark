import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaBuilding, 
  FaPlus, 
  FaUpload, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaSave,
  FaSpinner,
  FaRocket
} from "react-icons/fa";

export default function OrganizationCreate() {
  const [formData, setFormData] = useState({
    org_name: "",
    org_description: "",
    org_logo: null,
    org_type: "Other",
    industry: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    social_links: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      youtube: "",
    },
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, dataset } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
    } else if (dataset.group === "address") {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else if (dataset.group === "social") {
      setFormData({
        ...formData,
        social_links: { ...formData.social_links, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.org_name || !formData.org_description || !formData.org_logo) {
      toast.error("⚠️ Required fields are missing!");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "address" || key === "social_links") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    try {
      setLoading(true);
      await api.post("/organization/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Organization Created!",
        text: "Your organization has been created successfully.",
        confirmButtonColor: "#0B2545", // Using our blue-900
        background: "#ffffff",
        color: "#0B2545"
      }).then(() => {
        // 👉 Redirect after success
        window.location.href = "/dashboard/organizer/org/view";
      });

      // Reset form
      setFormData({
        org_name: "",
        org_description: "",
        org_logo: null,
        org_type: "Other",
        industry: "",
        contact_email: "",
        contact_phone: "",
        website: "",
        address: { street: "", city: "", state: "", postal_code: "", country: "" },
        social_links: { facebook: "", twitter: "", linkedin: "", instagram: "", youtube: "" },
      });
      setLogoPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error creating organization.");
    } finally {
      setLoading(false);
    }
  };

  const socialIcons = {
    facebook: <FaFacebook className="text-blue-600" />,
    twitter: <FaTwitter className="text-blue-400" />,
    linkedin: <FaLinkedin className="text-blue-700" />,
    instagram: <FaInstagram className="text-pink-600" />,
    youtube: <FaYoutube className="text-red-600" />
  };

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
            <div className="w-10 h-10 bg-[#FFB238] rounded-xl flex items-center justify-center">
              <FaPlus className="text-blue-900 text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Create Organization</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start your journey by creating your organization profile. This will help volunteers discover and connect with your cause.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-blue-900" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Basic Information</h2>
              </div>

              {/* Organization Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Organization Name *</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="org_name"
                  value={formData.org_name}
                  onChange={handleChange}
                  placeholder="Enter your organization name"
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  required
                />
              </div>

              {/* Organization Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description *</label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  name="org_description"
                  value={formData.org_description}
                  onChange={handleChange}
                  placeholder="Tell us about your organization's mission and goals"
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800 resize-none"
                  required
                />
              </div>

              {/* Organization Type & Industry */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Organization Type</label>
                  <select
                    name="org_type"
                    value={formData.org_type}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  >
                    <option value="Company">Company</option>
                    <option value="Non-Profit">Non-Profit</option>
                    <option value="Educational">Educational</option>
                    <option value="Government">Government</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Healthcare, Education, Technology"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-green-700" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Contact Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Contact Email *</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="contact@organization.com"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Contact Phone</label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.organization.com"
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-orange-700" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Address</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Street Address</label>
                  <input 
                    data-group="address" 
                    name="street" 
                    value={formData.address.street} 
                    onChange={handleChange} 
                    placeholder="123 Main Street" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">City</label>
                  <input 
                    data-group="address" 
                    name="city" 
                    value={formData.address.city} 
                    onChange={handleChange} 
                    placeholder="Colombo" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">State/Province</label>
                  <input 
                    data-group="address" 
                    name="state" 
                    value={formData.address.state} 
                    onChange={handleChange} 
                    placeholder="WP" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Postal Code</label>
                  <input 
                    data-group="address" 
                    name="postal_code" 
                    value={formData.address.postal_code} 
                    onChange={handleChange} 
                    placeholder="10001" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Country</label>
                  <input 
                    data-group="address" 
                    name="country" 
                    value={formData.address.country} 
                    onChange={handleChange} 
                    placeholder="Sri Lanka" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800" 
                  />
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-[#FFB238] rounded-lg flex items-center justify-center">
                  <FaGlobe className="text-blue-900" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Social Media</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {["facebook", "youtube"].map((platform) => (
                  <div key={platform} className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      {socialIcons[platform]}
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                    <input
                      data-group="social"
                      name={platform}
                      value={formData.social_links[platform]}
                      onChange={handleChange}
                      placeholder={`https://${platform}.com/yourpage`}
                      className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUpload className="text-purple-700" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Organization Logo *</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl border-2 border-dashed border-blue-200">
                <motion.label 
                  className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-2xl cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-900 overflow-hidden shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="text-center p-4">
                      <FaUpload className="text-gray-400 text-2xl mb-2 mx-auto" />
                      <span className="text-gray-500 text-sm font-medium">Upload Logo</span>
                    </div>
                  )}
                  <input type="file" name="org_logo" accept="image/*" onChange={handleChange} className="hidden" required />
                </motion.label>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">Organization Logo</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Upload a high-quality logo (PNG, JPG) that represents your organization. 
                    Recommended size: 400x400px or larger. This will be displayed on your organization profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
                  Creating Organization...
                </>
              ) : (
                <>
                  <FaRocket />
                  Create Organization
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
