import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import happypeople from '../assets/images/happypeople.jpg'; 
import s1 from '../assets/images/Archstone-Logo-white';
import s2 from  'from '../assets/images/Archstone-Logo-white' ;  
import s3 from 
import s4 from 
const Hero = () => {
  const ref = useRef(null);

  // Scroll-related animation
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"], // optional tweak
  });

  // Translate Y value for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={ref} className="relative h-screen w-full text-white overflow-hidden">
      {/* Background Image with motion */}
      <motion.img
        style={{ y }}
        src={happypeople}
        alt="Volunteer"
        className="absolute inset-0 w-full h-full object-cover z-0 bg-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between h-full">
        {/* Hero Text */}
        <div className="flex flex-col items-start justify-center px-10 md:px-20 max-w-2xl mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
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

          {/* Feature icons */}
          <div className="flex space-x-4 mt-6 text-white">
            <motion.div whileHover={{ scale: 1.1 }} className="p-3 border rounded-full border-orange-400">
              ❤️
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="p-3 border rounded-full border-gray-200">
              🌍
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="p-3 border rounded-full border-gray-200">
              📊
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="p-3 border rounded-full border-gray-200">
              👁️
            </motion.div>
          </div>
        </div>

        {/* Sponsors */}
        <div className="bg-black bg-opacity-80 py-4 px-10 text-center mt-10">
          <h3 className="text-sm text-gray-300 mb-2 font-bold">SPONSORS</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            <img src="/sponsor1.png" alt="s1" className="h-8" />
            <img src="/sponsor2.png" alt="s2" className="h-8" />
            <img src="/sponsor3.png" alt="s3" className="h-8" />
            <img src="/sponsor4.png" alt="s4" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
