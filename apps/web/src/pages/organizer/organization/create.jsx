import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../../api/axios";

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
  const [message, setMessage] = useState("");

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
      setMessage("Required fields are missing!");
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
      setMessage("");
      await api.post("/organization/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Organization created successfully!");
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
      setMessage("❌ Error creating organization.");
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
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-10 text-gray-800"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide text-gray-900">
          Create <span className="text-blue-500">Organization</span>
        </h2>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-gray-100 text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Org Name */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="org_name"
            value={formData.org_name}
            onChange={handleChange}
            placeholder="Organization Name"
            className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
            required
          />

          {/* Org Description */}
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            name="org_description"
            value={formData.org_description}
            onChange={handleChange}
            placeholder="Organization Description"
            rows={4}
            className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
            required
          />

          {/* Org Type & Industry */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="org_type"
              value={formData.org_type}
              onChange={handleChange}
              className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
            >
              <option>Company</option>
              <option>Non-Profit</option>
              <option>Educational</option>
              <option>Government</option>
              <option>Other</option>
            </select>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Industry"
              className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="Contact Email"
              className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
              required
            />
            <input
              type="text"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="Contact Phone"
              className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Website */}
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
            className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
          />

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <input data-group="address" name="street" value={formData.address.street} onChange={handleChange} placeholder="Street" className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300" />
            <input data-group="address" name="city" value={formData.address.city} onChange={handleChange} placeholder="City" className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300" />
            <input data-group="address" name="state" value={formData.address.state} onChange={handleChange} placeholder="State" className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300" />
            <input data-group="address" name="postal_code" value={formData.address.postal_code} onChange={handleChange} placeholder="Postal Code" className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300" />
            <input data-group="address" name="country" value={formData.address.country} onChange={handleChange} placeholder="Country" className="col-span-2 p-4 rounded-xl bg-gray-100 border-2 border-gray-300" />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4">
            {["facebook", "twitter", "linkedin", "instagram", "youtube"].map((platform) => (
              <input
                key={platform}
                data-group="social"
                name={platform}
                value={formData.social_links[platform]}
                onChange={handleChange}
                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                className="p-4 rounded-xl bg-gray-100 border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            ))}
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-6">
            <label className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-gray-500 text-center">Upload Logo</span>
              )}
              <input type="file" name="org_logo" accept="image/*" onChange={handleChange} className="hidden" />
            </label>
            <p className="text-gray-500 text-sm max-w-xs">
              Upload a high-quality logo to represent your organization.
            </p>
          </div>

          {/* Submit */}
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
