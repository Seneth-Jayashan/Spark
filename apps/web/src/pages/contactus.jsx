import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import contactpic from "../assets/images/contactusformImage.png";
import api from "../api/axios";

const ContactSection = () => {
  const [input, setInputs] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!input.name.trim()) newErrors.name = "Name is required.";
    if (!input.email.trim()) newErrors.email = "Email is required.";
    if (!input.subject.trim()) newErrors.subject = "Subject is required.";
    if (!input.message.trim()) newErrors.message = "Message is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await api.post("/contact/", {
        name: input.name.trim(),
        gmail: input.email.trim(),
        subject: input.subject.trim(),
        message: input.message.trim(),
      });

      Swal.fire({
        title: "Success!",
        text: "Your message has been submitted. Our team will get back to you soon!",
        icon: "success",
        timer: 3500,
        timerProgressBar: true,
      });

      setInputs({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again later.";
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Framer motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
            <a href="mailto:support@SPARK.org" className="text-blue-600 hover:underline">
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
  className="grid grid-cols-1 gap-4"   // ✅ only 1 column, full width
>
  {/* Full Name */}
  <motion.div variants={cardVariants} className="mt-4">
    <label className="block text-sm font-semibold text-gray-700">
      Full Name
    </label>
    <input
      type="text"
      name="name"
      value={input.name}
      onChange={handleChange}
      className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 ${
        errors.name
          ? "border-red-500 focus:ring-red-500"
          : "border-yellow-500 focus:ring-yellow-600"
      }`}
      placeholder="Your Name"
    />
    {errors.name && (
      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
    )}
  </motion.div>
</motion.div>

            {/* Email */}
            <motion.div variants={cardVariants} className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-yellow-500 focus:ring-yellow-600"
                }`}
                placeholder="Email Address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </motion.div>

            {/* Subject */}
            <motion.div variants={cardVariants} className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={input.subject}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.subject ? "border-red-500 focus:ring-red-500" : "border-yellow-500 focus:ring-yellow-600"
                }`}
                placeholder="Subject"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </motion.div>

            {/* Message */}
            <motion.div variants={cardVariants} className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">Message</label>
              <textarea
                name="message"
                value={input.message}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 min-h-[120px] ${
                  errors.message ? "border-red-500 focus:ring-red-500" : "border-yellow-500 focus:ring-yellow-600"
                }`}
                placeholder="Write us a message"
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={cardVariants} className="mt-6 text-center">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0px 8px 16px rgba(255, 167, 38, 0.4)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-white px-10 py-3 rounded-full font-semibold text-sm uppercase tracking-wide disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSection;
