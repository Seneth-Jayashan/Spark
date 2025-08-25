import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import group1 from '../assets/images/about us images/group1.png';
import group2 from '../assets/images/about us images/group2.png';
import group3 from '../assets/images/about us images/group3.png';
import onepersonfull from '../assets/images/about us images/one-person-full.png';
import p1 from '../assets/images/about us images/person1.png';
import p2 from '../assets/images/about us images/person2.png';
import p3 from '../assets/images/about us images/person3.png';
import p4 from '../assets/images/about us images/person4.png';
import {  HeartHandshake, Lightbulb, LineChart, Linkedin, LinkedinIcon, Puzzle } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';


const AboutUs = () => {
   
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
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
           <div ref={ref} className="relative h-screen w-full text-white overflow-hidden">
             <motion.img
               src={group1}
               alt="Volunteer1"
               className="absolute inset-0 w-full h-full object-cover z-0 bg-center"
             />
               <motion.div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                
                 <div className="relative z-20 flex flex-col items-center justify-between h-full">

                          <div className="flex flex-col items-center justify-center px-10 md:px-40 max-w-7xl mt-24">
                            
                            <motion.h1
                              style={{ y, scale }}
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className=" text-center text-4xl md:text-6xl font-bold mb-6 pt-40" >

                              Empowering <span className=' text-yellow-500'> Volunteering  </span> 

                              <br />
                              <span className="text-primary">Simplified.</span>

                            </motion.h1>

                            
                              <motion.p 
                              style={{ y, scale }} 
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className=' text-center text-xl mt-9 px-5 lg:px-40  '>We connect passionate people with meaningful causes through 
                                the power of technology
                              </motion.p>

                            
                
                            <motion.button
                              
                              style={{ y }} 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-yellow-500 text-white mt-10 px-12 py-3 rounded-full font-semibold"
                            >
                              JOIN WITH US
                            </motion.button>
            
                     </div>

                 </div>

             </div>


    <div  className="relative bg-white py-10 mx-2 sm:mx-12 md:px-20 overflow-hidden">
    

      <div className="flex flex-col md:flex-row-3 md:justify-center  md:items-center gap-20 relative z-10">
    
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
         className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:w-auto">
          <motion.img
            whileInView={{ scale: [0.9, 1] }} 
            transition={{ duration: 0.8 }}
            src={group1}
            alt="Founders"
            className="w-[290px] h-[290px] rounded-full object-cover border-4 border-yellow-400"/>
         <div className=' flex-col px-4 md:px-8 max-w-xl border-2 border-blue-400 w-full rounded-lg p-5'>
          <h2 className="mt-2 text-4xl font-semibold">How Spark Came to Life</h2>
          <p className="mt-2 text-gray-600 text-center w-full ">It started with one idea - to make volunteering easier and more impactful</p>
          <ul className="text-sm text-gray-500 mt-3 space-y-1 ">
            <li>2023 - Idea born at a student hackathon</li>
            <li>2024 - Launched MVP, helped 10+ NGOs</li>
            <li>2025 - 5,000+ volunteers & 100+ events hosted</li>
            <li>Future - Expanding across Sri Lanka & South Asia</li>
          </ul>
          </div>   
        </motion.div>


       
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
        className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 text-center md:w-auto ">
         <div className=' flex-col px-4 md:px-8 max-w-xl border-2 border-blue-400 w-full rounded-lg p-5 '>
          <h2 className="mt-4 text-4xl font-semibold">Our Mission</h2>
          <p className="mt-2 text-gray-600">
            To build a connected world where every act of service matters.
          </p>
         </div> 
          <motion.img
            whileInView={{ scale: [0.9, 1] }}
            transition={{ duration: 0.8 }}
            src={group2}
            alt="Mission Meeting"
            className="w-[290px] h-[290px] rounded-full object-cover border-4 border-yellow-400"
          />
        </motion.div>

        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
        className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:w-auto">
          <motion.img
            whileInView={{ scale: [0.9, 1] }} 
            transition={{ duration: 0.8 }}
            src={group3}
            alt="Volunteering"
            className="w-[290px] h-[290px] rounded-full object-cover border-4 border-yellow-400"
          />
         <div className='flex-col px-4 md:px-8 max-w-xl border-2 border-blue-400 w-full rounded-lg p-5'>
          <h2 className="mt-4 text-4xl font-semibold">Vision</h2>
          <p className="mt-2 text-gray-600">
            A digital ecosystem where volunteering is effortless, inclusive, and empowering.
          </p>
         </div>  
        </motion.div>
      </div>


    </div>



  <div className="py-16 px-6 md:px-28 bg-white text-center overflow-hidden">
    
  <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
   className="text-4xl font-bold mb-12">Core Values</motion.h2>

  
  <div className="flex flex-wrap max-xl:justify-center sm:gap-x-56 xl:ml-40 gap-x-2 gap-y-20 relative mt-20">

    
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
     className="w-64 border border-blue-400 rounded-xl p-6 text-center shadow-2xl">
      <Puzzle className="mx-auto h-12 w-12 text-black mb-4" />
      <h3 className="font-semibold text-lg mb-2">Collaboration</h3>
      <p className="text-gray-600 text-sm">We build together to create lasting impact.</p>
    </motion.div>

  
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
     className="w-64 border border-blue-400 rounded-xl p-6 text-center shadow-2xl">
      <Lightbulb className="mx-auto h-12 w-12 text-black mb-4" />
      <h3 className="font-semibold text-lg mb-2">Innovation</h3>
      <p className="text-gray-600 text-sm">We simplify volunteering through smart tools.</p>
    </motion.div>

  
    <div className="w-full flex flex-wrap max-xl:justify-center xl:ml-60 sm:gap-x-56 gap-x-2 xl:gap-x-56 gap-y-20 ">

      
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
       className="w-64 border border-blue-400 rounded-xl p-6 text-center shadow-2xl">
        <LineChart className="mx-auto h-12 w-12 text-black mb-4" />
        <h3 className="font-semibold text-lg mb-2">Growth</h3>
        <p className="text-gray-600 text-sm">We help organizations and individuals scale good.</p>
      </motion.div>

     
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
       className="w-64 border border-blue-400 rounded-xl p-6 text-center shadow-2xl">
        <HeartHandshake className="mx-auto h-12 w-12 text-black mb-4" />
        <h3 className="font-semibold text-lg mb-2">Empathy</h3>
        <p className="text-gray-600 text-sm">Every community matters.</p>
      </motion.div>
    </div>
  </div>
</div>





<div className="py-16 px-6 md:px-32 text-center mt-8 overflow-hidden">

  <div className=' grid lg:grid-cols-2 md:grid-rows-2 gap-8'>

    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
     className=" border border-blue-400 p-6 rounded-xl bg-white relative shadow-xl">

      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
         <motion.img src={p3} alt="oneperson" 
            whileInView={{ scale: [0.9, 1] }}
            transition={{ duration: 0.8 }}
         className='className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"' />
      </div>

      <div className='p-8'>
        <p className='font-semibold text-xl text-blue-800' >Seneth Jayashan</p>
        <p className='font-semibold text-2xl mt-2'>Project Leader</p>
        <p className='mt-2'>Seneth leads our volunteer initiative with a strong passion for community service and digital empowerment. 
          With a background in software engineering, he ensures the project runs smoothly and efficiently. His leadership
           and dedication inspire the team to make a real impact through technology and teamwork.</p>

        <div className=' flex items-center justify-center gap-6 mt-6'>

          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.95 }}>
          <FaGithub className='w-10 h-10 cursor-pointer '/>
          </motion.div>
          
          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.90 }} >
           <FaLinkedin className='w-10 h-10 cursor-pointer'/>
          </motion.div>
       </div>   
      </div>
    </motion.div>


    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
     className=" border border-blue-400 p-6 rounded-xl bg-white relative shadow-xl max-lg:mt-12">

      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
         <motion.img src={p2} alt="oneperson" 
            whileInView={{ scale: [0.9, 1] }}
            transition={{ duration: 0.8 }}
         className='className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"' />
      </div>

      <div className='p-8'>
        <p className='font-semibold text-xl text-blue-800' >Abhishek Appuhami</p>
        <p className='font-semibold text-2xl mt-2'>Developer & Technical Support</p>
        <p className='mt-2'>Abhishek builds and maintains the technical foundation of our website. From coding features to solving bugs,
           she ensures the platform functions perfectly. Her commitment to using technology for good helps bring 
           our team’s vision to life.</p>

       <div className=' flex items-center justify-center gap-6 mt-12'>

          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.95 }}>
          <FaGithub className='w-10 h-10 cursor-pointer '/>
          </motion.div>
          
          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.90 }} >
           <FaLinkedin className='w-10 h-10 cursor-pointer'/>
          </motion.div>
     
       </div>   
      </div>
    </motion.div>



    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
     className="  border border-blue-400 p-6 rounded-xl bg-white relative shadow-xl mt-12">

      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
         <motion.img src={p4} alt="oneperson" 
            whileInView={{ scale: [0.9, 1] }}
            transition={{ duration: 0.8 }}
         className='className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"' />
      </div>

      <div className='p-8'>
        <p className='font-semibold text-xl text-blue-800' >Sajana Wickramarathna</p>
        <p className='font-semibold text-2xl mt-2'>Content & Outreach Manager</p>
        <p className='mt-2'>Sajana is responsible for our public communications, community connections, and social media presence.
           He loves storytelling and bringing people together for meaningful causes. his creative energy keeps our message clear,
            positive, and inspiring for all who visit our platform.</p>

       <div className=' flex items-center justify-center gap-6 mt-6'>

          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.95 }}>
          <FaGithub className='w-10 h-10 cursor-pointer '/>
          </motion.div>
          
          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.90 }} >
           <FaLinkedin className='w-10 h-10 cursor-pointer'/>
          </motion.div>
     
         </div>   
         <div>    
       </div>
    </div>  
    </motion.div>



    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
     className="  border border-blue-400 p-6 rounded-xl bg-white relative shadow-xl mt-12">

      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
         <motion.img src={p1} alt="oneperson" 
            whileInView={{ scale: [0.9, 1] }}
            transition={{ duration: 0.8 }}
         className='className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"' />
      </div>

      <div className='p-8'>
        <p className='font-semibold text-xl text-blue-800' >Tharusha Rukshan</p>
        <p className='font-semibold text-2xl mt-2'>Design & User Experience</p>
        <p className='mt-2'>Tharusha designs and refines the visual aspects of our website. With a keen eye for detail and a heart
           for service, he ensures every page looks clean, accessible, and welcoming. His goal is to make the volunteer experience 
           feel easy and enjoyable for everyone.</p>


      <div className=' flex items-center justify-center gap-6 mt-12'>

          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.95 }}>
          <FaGithub className='w-10 h-10 cursor-pointer '/>
          </motion.div>
          
          <motion.div
          whileHover={{ scale: 1.10 }}
          whileTap={{ scale: 0.90 }} >
           <FaLinkedin className='w-10 h-10 cursor-pointer'/>
          </motion.div>
       </div>   
      </div>  
    </motion.div>

  </div>

</div>




<div className=' relative h-screen w-full overflow-hidden  ' >

  <motion.img src={onepersonfull} alt="onepersonfull"
   initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
  className="absolute inset-0 w-full h-full object-cover z-0 bg-center" />

  <motion.div
  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} 
  className='absolute inset-0 bg-black bg-opacity-50 z-10  '>

    <div className='flex flex-col items-center justify-end mr-10 md:mr-28 mt-40 mb-20 w-full max-w-xl ml-auto gap-6  ' >

       <motion.h1
       initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
       className='font-semibold text-4xl text-center text-white '>Ready To Make a Difference <br/>Together?</motion.h1>

       <motion.button  
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}                     
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className="bg-blue-800 text-white mt-10 w-60 py-3 rounded-full font-semibold">
           Join as Volunteer
        </motion.button>

        <motion.button  
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}                     
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className="bg-yellow-500 text-white mt-10 w-60 py-3 rounded-full font-semibold">
           Join as Organization
        </motion.button>

        <motion.button 
         initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}                      
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className="bg-blue-800 text-white mt-10 w-60 py-3 rounded-full font-semibold">
           Contact Us
        </motion.button>
            
    </div>
    

  </motion.div>




</div>

  

    </>

  )
}

export default AboutUs