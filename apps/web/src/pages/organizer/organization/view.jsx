import React, { useEffect } from "react";
import { useOrg } from "../../../contexts/OrgContext";
import { motion } from "framer-motion";
import { 
  FaGlobe, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaIndustry,
  FaCalendarAlt,
  FaUsers,
  FaHeart
} from "react-icons/fa";

export default function ViewOrganization() {
  const { currentOrg, fetchLoggedUserOrg, loading, error } = useOrg();

  useEffect(() => {
    if (!currentOrg) fetchLoggedUserOrg();
  }, [currentOrg, fetchLoggedUserOrg]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Loading organization...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-red-500 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-500">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBuilding className="text-blue-900 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Organization Found</h2>
          <p className="text-gray-600">We couldn't find any organization information.</p>
        </motion.div>
      </div>
    );
  }

  const org = currentOrg.organization;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
            className="h-64 md:h-80 bg-cover bg-center relative"
            style={{ 
              backgroundImage: `url(${org.cover_image || import.meta.env.VITE_SERVER_URL + org.org_logo})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
          
        {/* Logo & Info */}
        <motion.div
            className="absolute bottom-6 left-6 md:left-12 flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
            src={`${import.meta.env.VITE_SERVER_URL}${org.org_logo}`}
            alt={org.org_name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl object-cover bg-white"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFB238] rounded-full flex items-center justify-center">
                <FaHeart className="text-white text-xs" />
              </div>
            </motion.div>
            
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
                {org.org_name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm md:text-base">
                <span className="bg-[#FFB238] text-blue-900 px-3 py-1 rounded-full font-semibold">
                  {org.org_type}
                </span>
                {org.industry && (
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                    {org.industry}
                  </span>
                )}
              </div>
          </div>
        </motion.div>
      </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* About Section */}
        <motion.div
            className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
            {/* About Card */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaBuilding className="text-blue-900 text-lg" />
            </div>
                <h2 className="text-2xl font-bold text-blue-900">About Our Organization</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {org.org_description}
              </p>
      </div>

      {/* Social Links */}
      {org.social_links && (
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#FFB238] rounded-xl flex items-center justify-center">
                    <FaGlobe className="text-blue-900 text-lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">Connect With Us</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(org.social_links).map(
              ([platform, url]) =>
                url && (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                          className="group p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl border border-blue-100 hover:border-[#FFB238] transition-all duration-300 text-center"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-blue-900 font-semibold group-hover:text-[#FFB238] transition-colors">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </div>
                  </motion.a>
                )
            )}
          </div>
              </div>
            )}
        </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Contact Info Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaEnvelope className="text-green-700 text-lg" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">Contact Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <FaEnvelope className="text-blue-900" />
                  <a 
                    href={`mailto:${org.contact_email}`}
                    className="text-blue-900 hover:text-[#FFB238] transition-colors font-medium"
                  >
                    {org.contact_email}
                  </a>
                </div>
                
                {org.contact_phone && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                    <FaPhone className="text-green-700" />
                    <a 
                      href={`tel:${org.contact_phone}`}
                      className="text-green-700 hover:text-green-800 transition-colors font-medium"
                    >
                      {org.contact_phone}
                    </a>
                  </div>
                )}
                
                {org.website && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                    <FaGlobe className="text-purple-700" />
                    <a 
                      href={org.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-700 hover:text-purple-800 transition-colors font-medium truncate"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Address Card */}
            {org.address && (
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FaMapMarkerAlt className="text-orange-700 text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">Location</h3>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">
                    {org.address.street}<br />
                    {org.address.city}, {org.address.state}<br />
                    {org.address.postal_code}<br />
                    {org.address.country}
                  </p>
                </div>
              </div>
            )}

            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
