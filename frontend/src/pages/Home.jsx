import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Globe, BarChart2, Eye } from "lucide-react";
import happypeople from "../assets/images/happypeople.jpg";
import s1 from "../assets/images/Archstone-Logo-White.png";
import s2 from "../assets/images/Boehringer-Ingelheim-White 1.png";
import s3 from "../assets/images/Patagonia-White 1.png";
import s4 from "../assets/images/Philadelphia-Foundation-White 1.png";
import feature1 from "../assets/images/1.png";
import feature2 from "../assets/images/2.png";
import feature3 from "../assets/images/3.png";
import awards from "../assets/images/awards.png";
import upcomingevents from "../assets/images/upcomingevents.png";

const HeroPage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

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
    <>
      <div
        ref={ref}
        className="relative h-screen w-full text-white overflow-hidden"
      >
        <motion.img
          style={{ y, scale }}
          src={happypeople}
          alt="Volunteer"
          className="absolute inset-0 w-full h-full object-cover z-0 bg-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

        <div className="relative z-20 flex flex-col justify-between h-full">
          <div className="flex flex-col items-start justify-center px-10 md:px-20 max-w-2xl mt-10">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 pt-40"
            >
              Empowering <br /> Volunteering. <br /> Simplified.
            </motion.h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-900 text-white px-6 py-3 rounded-md font-semibold"
            >
              JOIN WITH US
            </motion.button>

            <div className="flex space-x-4 mt-6 text-white">
              {[
                { Icon: Heart, label: "Wishlist" },
                { Icon: Globe, label: "Explore" },
                { Icon: BarChart2, label: "Insights" },
                { Icon: Eye, label: "View" },
              ].map(({ Icon, label }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="relative group p-3 border-4 border-orange-400 cursor-pointer bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl"
                >
                  <Icon className="text-black w-6 h-6" />
                  <span className="absolute top-full mt-2 px-3 py-1 text-sm text-blue-700 bg-white/80 rounded-3xl shadow-xl backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-black bg-opacity-80 py-4 px-10 text-center mt-10">
            <h3 className="text-sm text-gray-300 mb-2 font-bold">SPONSORS</h3>
            <div className="flex justify-center gap-8 flex-wrap">
              {[s1, s2, s3, s4].map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`sponsor-${idx}`}
                  className="h-8"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white text-gray-800 py-16 px-4 md:px-20">
        {/* Features Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            {
              img: feature1,
              title: "Smart Event Matching",
              desc: "Find events that fit your skills and schedule",
            },
            {
              img: feature2,
              title: "Earn Badges & Track Impact",
              desc: "Collect points, earn badges, and see your volunteering journey",
            },
            {
              img: feature3,
              title: "Community First",
              desc: "Join a growing network of changemakers and helpers",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="group border rounded-2xl p-6 shadow-lg bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <img
                src={f.img}
                alt={f.title}
                className="mx-auto h-16 mb-4 group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="text-xl font-bold text-blue-900 group-hover:text-orange-500 transition-colors duration-300">
                {f.title}
              </h3>
              <p className="text-sm mt-2 text-gray-600 group-hover:text-gray-800">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Events and Achievements Section */}
        <motion.div
          className="w-full bg-white py-16 px-6 md:px-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            {/* Left Image */}
            <div className="flex justify-center md:justify-end">
              <motion.img
                whileInView={{ scale: [0.9, 1] }}
                whileHover={{ rotate: 2, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={upcomingevents}
                alt="Upcoming Events"
                className="w-full max-w-sm md:max-w-md rounded-xl shadow-xl object-contain"
              />
            </div>

            {/* Right Content */}
            <div className="text-center md:text-left">
              <h4 className="text-blue-700 text-sm font-bold uppercase tracking-wide mb-2">
                Events
              </h4>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Upcoming Opportunities
              </h2>
              <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed max-w-xl">
                Discover what's happening near you and join causes that matter.
              </p>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                View All Events
              </button>
            </div>
          </div>
        </motion.div>

        {/* Achievements Section */}

        <motion.div
          className="w-full bg-white py-16 px-6 md:px-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
            {/* Left Content */}
            <div className="text-center md:text-left">
              <h4 className="text-blue-700 text-sm font-bold uppercase tracking-wide mb-2">
                Achievements
              </h4>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Volunteering That Rewards You
              </h2>
              <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed max-w-xl">
                Collect points, level up, and earn real-world recognition.
              </p>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                Learn About Badges
              </button>
            </div>

            {/* Right Image */}
            <div className="flex justify-center md:justify-end">
              <motion.img
                whileInView={{ scale: [0.9, 1] }}
                whileHover={{ rotate: -2, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src={awards}
                alt="Rewards"
                className="w-full max-w-sm md:max-w-md rounded-xl shadow-xl object-contain"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-20 text-center "
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h4 className="text-blue-500 uppercase tracking-wide font-semibold text-sm">
            Testimonials
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-12">
            Read What Others Have To Say
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Seneth Jayshan",
                img: "https://i.ibb.co/jH9Jm5T/testimonialuser.jpg",
                review: `After retiring, Mrs. Perera felt disconnected—until she discovered VolunteerX. She began mentoring children in weekend reading programs. "Seeing them smile when they finally read a sentence—it brings me joy," she shares. Now she’s helped over 50 kids build confidence, one book at a time.`,
              },
              {
                name: "Ishani Perera",
                img: "https://i.ibb.co/3M0rHdL/testimonialuser2.jpg",
                review: `As a university student, I was searching for purpose outside academics. VolunteerX allowed me to organize food drives and clean-up events. I've made lifelong friends and seen real community change. It’s amazing what we can do when we work together.`,
              },
              {
                name: "Devinda Fernando",
                img: "https://i.ibb.co/3Yp3pwV/testimonialuser3.jpg",
                review: `I used to feel like one person couldn’t make a difference. VolunteerX shattered that idea. Now I regularly lead beach cleanups and tech workshops. Volunteering gave me leadership skills and a deeper sense of belonging.`,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                }}
                className="relative bg-white rounded-xl border border-blue-400 p-6 pt-16 shadow-md transition-transform duration-300"
              >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover transition-transform"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {testimonial.review}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-blue-600 to-blue-800 text-white mt-20 rounded-2xl p-10 md:p-14 text-center shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-base md:text-lg uppercase mb-4 tracking-widest font-medium">
            Ready to take the next step?
          </p>
          <h3 className="text-3xl md:text-4xl font-bold leading-relaxed">
            Sign up, find events, and begin your <br /> volunteering journey.
          </h3>
          <motion.button
            whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
            transition={{ duration: 0.3 }}
            className="mt-8 bg-black text-white px-8 py-4 text-lg rounded-full hover:bg-gray-900 transition"
          >
            Get Started
          </motion.button>
        </motion.div>

        <h3 className="text-3xl md:text-4xl font-bold leading-relaxed">
            Sign up, find events, and begin your <br /> volunteering journey.
          </h3>
      </div>
    </>
  );
};

export default HeroPage;
