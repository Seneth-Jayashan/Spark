import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../../api/axios";

export default function OrganizationCreate() {
  const [formData, setFormData] = useState({
    org_name: "",
    org_description: "",
    org_logo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.org_name || !formData.org_description || !formData.org_logo) {
      setMessage("All fields are required!");
      return;
    }

    const data = new FormData();
    data.append("org_name", formData.org_name);
    data.append("org_description", formData.org_description);
    data.append("org_logo", formData.org_logo);

    try {
      setLoading(true);
      setMessage("");
      await api.post("/organization/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Organization created successfully!");
      setFormData({ org_name: "", org_description: "", org_logo: null });
      setLogoPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("Error creating organization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 text-gray-800"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide text-gray-900">
          Create <span className="text-blue-500">Organization</span>
        </h2>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name Input */}
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              type="text"
              name="org_name"
              value={formData.org_name}
              onChange={handleChange}
              required
              placeholder="Organization Name"
              className="peer w-full p-4 rounded-xl bg-gray-100 text-gray-900 placeholder-transparent border-2 border-gray-300 focus:border-blue-500 outline-none transition"
            />
            <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 transition-all 
              peer-placeholder-shown:top-4 
              peer-placeholder-shown:text-gray-400 
              peer-placeholder-shown:text-base
              peer-focus:-top-2.5 
              peer-focus:text-gray-700 
              peer-focus:text-sm">
              Organization Name
            </label>
          </div>

          {/* Description Input */}
          <div className="relative">
            <motion.textarea
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              name="org_description"
              value={formData.org_description}
              onChange={handleChange}
              required
              placeholder="Organization Description"
              rows={5}
              className="peer w-full p-4 rounded-xl bg-gray-100 text-gray-900 placeholder-transparent border-2 border-gray-300 focus:border-blue-500 outline-none resize-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 transition"
            />
            <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 transition-all 
              peer-placeholder-shown:top-4 
              peer-placeholder-shown:text-gray-400 
              peer-placeholder-shown:text-base
              peer-focus:-top-2.5 
              peer-focus:text-gray-700 
              peer-focus:text-sm">
              Organization Description
            </label>
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-6">
            <label className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-500 text-center">Upload Logo</span>
              )}
              <input
                type="file"
                name="org_logo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            <p className="text-gray-500 text-sm max-w-xs">
              Upload a high-quality logo. This will represent your organization on the dashboard.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white p-4 rounded-xl font-bold text-lg transition shadow-md"
          >
            {loading ? "Creating..." : "Create Organization"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
