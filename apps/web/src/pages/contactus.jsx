import React, { useState } from "react";
import { motion } from "framer-motion";
import contactpic from "../assets/images/contactusformImage.png";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2 },
    },
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);
      // TODO: send formData to backend / email service
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="relative pt-32 pb-20 px-4 flex justify-center min-h-screen bg-white">
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-white rounded-xl border-2 border-yellow-500 shadow-md px-8 py-10 lg:ml-auto lg:mr-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img
          src={contactpic}
          alt="Phone Graphic"
          className="absolute w-[700px] top-[100px] left-[-665px] rotate-[20deg] pointer-events-none select-none z-0 opacity-80"
        />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Get in Touch with SPARK ORG
          </h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            You can reach the SPARK ORG community support team by sending an
            email to{" "}
            <a
              href="mailto:support@SPARK.org"
              className="text-blue-600 hover:underline"
            >
              support@SPARK.org
            </a>
            , giving us a call at 011-XXX-XXX, or filling out the form below.
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* First Name */}
              <motion.div variants={cardVariants}>
                <label className="block text-sm font-semibold text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-yellow-500 focus:ring-yellow-600"
                  }`}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </motion.div>

              {/* Last Name */}
              <motion.div variants={cardVariants}>
                <label className="block text-sm font-semibold text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-yellow-500 focus:ring-yellow-600"
                  }`}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </motion.div>
            </motion.div>

            {/* Email */}
            <motion.div variants={cardVariants} className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-yellow-500 focus:ring-yellow-600"
                }`}
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </motion.div>

            {/* Subject */}
            <motion.div variants={cardVariants} className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.subject
                    ? "border-red-500 focus:ring-red-500"
                    : "border-yellow-500 focus:ring-yellow-600"
                }`}
                placeholder="Subject"
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </motion.div>

            {/* Message */}
            <motion.div variants={cardVariants} className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 min-h-[120px] ${
                  errors.message
                    ? "border-red-500 focus:ring-red-500"
                    : "border-yellow-500 focus:ring-yellow-600"
                }`}
                placeholder="Write us a message"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={cardVariants} className="mt-6 text-center">
              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0px 8px 16px rgba(255, 167, 38, 0.4)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-white px-10 py-3 rounded-full font-semibold text-sm uppercase tracking-wide"
              >
                SUBMIT
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSection;
