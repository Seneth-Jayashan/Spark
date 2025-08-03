import React from "react";
import { motion } from "framer-motion";
import contactpic from "../assets/images/contactusformImage.png";

const ContactSection = () => {
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

  return (
    <div className="relative pt-32 pb-20 px-4 flex justify-center min-h-screen bg-white">
      {/* Form Card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-white rounded-xl border-2 border-yellow-500 shadow-md px-8 py-10 lg:ml-auto lg:mr-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Phone Image Overlapping */}
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

          {/* Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <motion.div variants={cardVariants}>
              <label className="block text-sm font-semibold text-gray-700">
                First Name{" "}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border border-yellow-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="First Name"
              />
            </motion.div>
            <motion.div variants={cardVariants}>
              <label className="block text-sm font-semibold text-gray-700">
                Last Name{" "}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border border-yellow-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="Last Name"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={cardVariants} className="mt-4">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address{" "}
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border border-yellow-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Email Address"
            />
          </motion.div>

          <motion.div variants={cardVariants} className="mt-4">
            <label className="block text-sm font-semibold text-gray-700">
              Subject{" "}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border border-yellow-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Subject"
            />
          </motion.div>

          <motion.div variants={cardVariants} className="mt-4">
            <label className="block text-sm font-semibold text-gray-700">
              Message{" "}
            </label>
            <textarea
              className="w-full px-4 py-2 mt-1 border border-yellow-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 min-h-[120px]"
              placeholder="Write us a message"
            ></textarea>
          </motion.div>

          <motion.div variants={cardVariants} className="mt-6 text-center">
            <motion.button
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
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSection;
