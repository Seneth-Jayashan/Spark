import React, { useEffect } from "react";
import { useOrg } from "../../../contexts/OrgContext";
import { motion } from "framer-motion";
import { FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ViewOrganization() {
  const { currentOrg, fetchLoggedUserOrg, loading, error } = useOrg();

  useEffect(() => {
    if (!currentOrg) fetchLoggedUserOrg();
  }, [currentOrg, fetchLoggedUserOrg]);

  if (loading) return <div className="p-6 text-gray-500 animate-pulse">Loading organization...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!currentOrg) return <div className="p-6">No organization found.</div>;

  const org = currentOrg.organization;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${org.cover_image || import.meta.env.VITE_SERVER_URL + org.org_logo})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/100"></div>
        {/* Logo & Info */}
        <motion.div
          className="absolute top-16 left-12 flex items-center space-x-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <motion.img
            src={`${import.meta.env.VITE_SERVER_URL}${org.org_logo}`}
            alt={org.org_name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            whileHover={{ scale: 1.05, rotate: 2 }}
          />
          <div>
            <h1 className="text-4xl font-extrabold text-white">{org.org_name}</h1>
            <p className="text-blue-300 font-semibold">{org.org_type}</p>
            <p className="text-gray-200">{org.industry}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="h-20"></div> {/* Spacer for overlap */}

      {/* Main Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* About */}
        <motion.div
          className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-3 text-gray-800 border-b pb-2">About</h2>
          <p className="text-gray-600 leading-relaxed">{org.org_description}</p>
        </motion.div>

        {/* Contact & Address */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col space-y-3">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-2">Contact Info</h2>
            <div className="flex items-center space-x-2 text-gray-700">
              <FaEnvelope /> <span>{org.contact_email}</span>
            </div>
            {org.contact_phone && (
              <div className="flex items-center space-x-2 text-gray-700">
                <FaPhone /> <span>{org.contact_phone}</span>
              </div>
            )}
            {org.website && (
              <div className="flex items-center space-x-2 text-blue-700 hover:text-blue-900">
                <FaGlobe />{" "}
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="underline">
                  {org.website}
                </a>
              </div>
            )}
          </div>

          {org.address && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-start space-x-3">
              <FaMapMarkerAlt className="text-gray-500 mt-1" />
              <p className="text-gray-700">
                {org.address.street}, {org.address.city}, {org.address.state}, {org.address.postal_code}, {org.address.country}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Social Links */}
      {org.social_links && (
        <motion.div
          className="mt-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Follow Us</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(org.social_links).map(
              ([platform, url]) =>
                url && (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-blue-50 text-blue-700 font-medium rounded-full shadow hover:bg-blue-100 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </motion.a>
                )
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
