import React, { useEffect } from "react";
import HomeLayout from "../layout/HomeLayout";
import { Link } from "react-router-dom";
import carVideo from "../../../../public/assets/car1.mp4";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation for text
const titleVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.0, 
      ease: "easeOut" 
    }
  }
};

const paragraphVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      delay: 0.2,
      ease: "easeOut" 
    }
  }
};

const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      delay: 0.4,
      ease: "easeOut" 
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      delay: 0.1 * custom,
      ease: "easeOut" 
    }
  })
};

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return { ref, controls };
};

const HomePage: React.FC = () => {
  // Animation controls for each section
  const heroAnimation = useScrollAnimation();
  const servicesAnimation = useScrollAnimation();
  const aboutAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();
  const contactAnimation = useScrollAnimation();

  return (
    <HomeLayout>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-black">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100 z-0"
          src={carVideo}
          autoPlay
          muted
          loop
          playsInline
        >
          Your browser does not support the video tag.
        </video>

        {/* Black gradient */}
        <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-black via-transparent to-transparent z-[1] pointer-events-none"></div>

        {/* Content Texts*/}
        <div 
          className="relative z-10 container mx-auto px-6 py-20 md:py-32"
          ref={heroAnimation.ref}
        >
          <div className="max-w-3xl">
            <motion.h1 
              className="text-3xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg"
              initial="hidden"
              animate={heroAnimation.controls}
              variants={titleVariant}
            >
              PRABATH MOTORS & DISTRIBUTORS
            </motion.h1>
            <motion.h1 
              className="text-4xl md:text-3xl font-bold leading-tight mb-4 drop-shadow-lg"
              initial="hidden"
              animate={heroAnimation.controls}
              variants={titleVariant}
              custom={1}
            >
              Your Trusted Partner for Vehicle Service & Repairs
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-8 drop-shadow-md"
              initial="hidden"
              animate={heroAnimation.controls}
              variants={paragraphVariant}
            >
              Experience top-quality automotive services with state-of-the-art
              facilities and expert technicians.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial="hidden"
              animate={heroAnimation.controls}
              variants={buttonVariant}
            >
              <Link
                to="/services"
                className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Explore Services
              </Link>
              <Link
                to="/appointment"
                className="bg-white hover:bg-gray-100 text-blue-900 font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-black" ref={servicesAnimation.ref}>
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-12"
            initial="hidden"
            animate={servicesAnimation.controls}
            variants={titleVariant}
          >
            OUR SERVICES
          </motion.h2>
          
          {/* Updated service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="rounded-lg overflow-hidden shadow-lg h-130 relative group" // Added group class for hover effects
                initial="hidden"
                animate={servicesAnimation.controls}
                variants={cardVariant}
                custom={index}
              >
                {/* Image container with zoom effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Regular gradient that shows by default */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent transition-all duration-300 group-hover:opacity-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + (index * 0.2), duration: 0.8 }}
                />
                
                {/* Green gradient that appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-600/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-200">
                    {service.description}
                  </p>
                  <Link 
                    to={`/services/${service.id}`} 
                    className="text-green-400 hover:text-white mt-4 inline-block transition-colors duration-300"
                  >
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-300 relative" ref={aboutAnimation.ref}>
       
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 to-black/50 pointer-events-none z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0 flex justify-center" 
              initial="hidden"
              animate={aboutAnimation.controls}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 1.0 } }
              }}
            >
              {/*  zoomed image hover effect */}
              <div className="rounded-lg shadow-lg overflow-hidden group w-4/5 mx-auto">
                <img
                  src="../../../../public/assets/images/img4.png"
                  alt="Our workshop"
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>
            <div className="md:w-1/2 md:pl-12">
              <motion.h2 
                className="text-3xl font-bold mb-6 text-white"
                initial="hidden"
                animate={aboutAnimation.controls}
                variants={titleVariant}
              >
                ABOUT PRABATH MOTORS
              </motion.h2>
              <motion.p 
                className="text-white mb-4"
                initial="hidden"
                animate={aboutAnimation.controls}
                variants={paragraphVariant}
                custom={1}
              >
                With over 15 years of experience, Prabath Motors has established
                itself as a leader in automotive service excellence. Our
                state-of-the-art facility in Sri Lanka combines the latest
                technology with skilled technicians to deliver superior results.
              </motion.p>
              <motion.p 
                className="text-white mb-6"
                initial="hidden"
                animate={aboutAnimation.controls}
                variants={paragraphVariant}
                custom={2}
              >
                We pride ourselves on transparency, quality workmanship, and
                customer satisfaction. Whether you need routine maintenance or
                complex repairs, we're committed to keeping your vehicle in
                optimal condition.
              </motion.p>
              <motion.div
                initial="hidden"
                animate={aboutAnimation.controls}
                variants={buttonVariant}
                custom={3}
              >
                <Link
                  to="/about"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 inline-block"
                >
                  Our Story
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50" ref={testimonialsAnimation.ref}>
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial="hidden"
            animate={testimonialsAnimation.controls}
            variants={titleVariant}
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow"
                initial="hidden"
                animate={testimonialsAnimation.controls}
                variants={cardVariant}
                custom={index}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-gray-500">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill={
                            i < testimonial.rating ? "currentColor" : "none"
                          }
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 bg-black text-white relative overflow-hidden group" 
        ref={ctaAnimation.ref}
      >
        {/* Hover gradient*/}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 
                       bg-gradient-to-t from-green-600/50 via-green-600/25 to-transparent 
                       rounded-50 opacity-0 
                       transition-all duration-700 ease-out 
                       group-hover:w-[200%] group-hover:h-full group-hover:opacity-100"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial="hidden"
            animate={ctaAnimation.controls}
            variants={titleVariant}
          >
            Ready to Experience Premium Service?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial="hidden"
            animate={ctaAnimation.controls}
            variants={paragraphVariant}
          >
            Schedule an appointment today and let our expert team take care of
            your vehicle.
          </motion.p>
          <motion.div
            initial="hidden"
            animate={ctaAnimation.controls}
            variants={buttonVariant}
          >
            <Link
              to="/appointment"
              className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              Book Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white" ref={contactAnimation.ref}>
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial="hidden"
            animate={contactAnimation.controls}
            variants={titleVariant}
          >
            Find Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                title: "Address",
                content: (
                  <>
                    123 Motor Avenue,
                    <br /> Colombo, Sri Lanka
                  </>
                ),
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                ),
                title: "Phone",
                content: "+94 123 456 789",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: "Email",
                content: "info@prabathmotors.com",
              },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center p-6"
                initial="hidden"
                animate={contactAnimation.controls}
                variants={cardVariant}
                custom={index}
              >
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </HomeLayout>
  );
};

// Sample data for services
const services = [
  {
    id: 1,
    title: "Regular Maintenance",
    description:
      "Keep your vehicle running smoothly with our comprehensive maintenance service packages.",
    image: "../../../../public/assets/images/img2.jpg",
  },
  {
    id: 2,
    title: "Brake Service",
    description:
      "Safety first! Our brake service ensures your vehicle stops reliably every time.",
    image: "../../../../public/assets/images/img1.jpg",
  },
  {
    id: 3,
    title: "Engine Repair",
    description:
      "From diagnostics to complete engine rebuilds, our technicians handle it all.",
    image: "../../../../public/assets/images/img3.jpg",
  },
  {
    id: 4,
    title: "Body Repair & Painting",
    description:
      "Professional body repair services and premium quality painting for accident damage or cosmetic enhancements.",
    image: "../../../../public/assets/images/img2.jpg", // Use your preferred image
  },
];

// Sample data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Lakmal Perera",
    rating: 5,
    text: "Outstanding service! They diagnosed and fixed my car's AC issue quickly and for a fair price.",
  },
  {
    id: 2,
    name: "Priyanka Silva",
    rating: 5,
    text: "I've been bringing my vehicles here for years. Their attention to detail and honesty are unmatched.",
  },
  {
    id: 3,
    name: "Dinesh Kumar",
    rating: 4,
    text: "Very professional team. They explained everything clearly and completed the work on time.",
  },
];

export default HomePage;
