import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import HomeLayout from "../layout/HomeLayout";

const ServicesPage = () => {
  // Animation setup
  const headerAnimation = useAnimationSection();
  const servicesAnimation = useAnimationSection();
  const ctaAnimation = useAnimationSection();
  
 
  const titleVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const paragraphVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <HomeLayout>
      {/* Header Section */}
      <section 
        className="relative text-white py-24 overflow-hidden"
        ref={headerAnimation.ref}
      >
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-1"></div>
        <img
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100 z-0"
          src="/assets/images/img12.jpg"
          alt="Services Header"
        />
        
        {/* Content Overlay */}
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-center drop-shadow-lg"
            initial="hidden"
            animate={headerAnimation.controls}
            variants={titleVariant}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto text-center drop-shadow-md"
            initial="hidden"
            animate={headerAnimation.controls}
            variants={paragraphVariant}
          >
            From routine maintenance to major repairs, our team of expert technicians delivers exceptional service to keep your vehicle running at its best.
          </motion.p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16" ref={servicesAnimation.ref} id="services-overview">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            initial="hidden"
            animate={servicesAnimation.controls}
            variants={titleVariant}
          >
            Services We Offer
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300"
                initial="hidden"
                animate={servicesAnimation.controls}
                variants={cardVariant}
                custom={index}
              >
                <div className="h-60 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center">Detailed Service Offerings</h2>
          
          {detailedServices.map((service, index) => (
            <div 
              key={service.id}
              id={service.slug}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-20 last:mb-0 scroll-mt-32`}
            >
              <div className={`md:w-1/2 mb-8 md:mb-0 ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="rounded-lg shadow-lg w-full h-auto max-h-96 object-cover" 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white relative overflow-hidden group" ref={ctaAnimation.ref}>
        {/* Hover gradient overlay */}
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
            Ready to Experience Our Premium Service?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial="hidden"
            animate={ctaAnimation.controls}
            variants={paragraphVariant}
          >
            Schedule an appointment today and let our expert team take care of your vehicle.
          </motion.p>
          <motion.div
            initial="hidden"
            animate={ctaAnimation.controls}
            variants={titleVariant}
            custom={1}
          >
            <Link
              to="/appointment"
              className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </HomeLayout>
  );
};

// Custom animation 
function useAnimationSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return { ref, controls, inView };
}

// Main service categories data
const services = [
  {
    id: 1,
    title: "Vehicle Maintenance",
    description: "Regular maintenance services including oil changes, filter replacements, and comprehensive vehicle inspections.",
    image: "/assets/images/img1.jpg",
    slug: "maintenance"
  },
  {
    id: 2,
    title: "Repairs & Diagnostics",
    description: "Expert diagnosis and repair services for mechanical issues, electrical problems, and performance concerns.",
    image: "/assets/images/img7.jpg",
    slug: "repairs"
  },
  {
    id: 3,
    title: "Body Shop & Painting",
    description: "Professional body repair services, dent removal, and premium quality painting for accident damage or cosmetic enhancements.",
    image: "/assets/images/img9.jpg",
    slug: "body-shop"
  },
  {
    id: 4,
    title: "Expert Care",
    description: "Browse our extensive catalog of genuine and OEM parts for all major vehicle makes and models with competitive pricing.",
    image: "/assets/images/img8.jpg",
    slug: "expert-care"
  },
  {
    id: 5,
    title: "Accessories & Upgrades",
    description: "Enhance your vehicle with our selection of premium accessories, performance upgrades, and comfort features.",
    image: "/assets/images/img2.jpg",
    slug: "accessories"
  },
  {
    id: 6,
    title: "Emergency Services",
    description: "24/7 emergency roadside assistance and towing services for unexpected breakdowns and accidents.",
    image: "/assets/images/img10.jpg",
    slug: "emergency"
  }
];

// Info about each service
const detailedServices = [
  {
    id: 1,
    title: "Vehicle Maintenance",
    description: "Our comprehensive maintenance services help extend your vehicle's life and maintain optimal performance. We follow manufacturer-recommended service schedules to keep your warranty valid.",
    image: "/assets/images/img1.jpg",
    slug: "maintenance",
    features: [
      "Oil and filter changes",
      "Brake system inspection and maintenance",
      "Tire rotation and balancing",
      "Fluid checks and top-ups",
      "Battery testing and replacement",
      "Air conditioning service"
    ]
  },
  {
    id: 2,
    title: "Repairs & Diagnostics",
    description: "Using state-of-the-art diagnostic equipment, our certified technicians can quickly identify and resolve issues affecting your vehicle's performance, safety, and reliability.",
    image: "/assets/images/img10.jpg",
    slug: "repairs",
    features: [
      "Engine diagnostics and repair",
      "Transmission service and repair",
      "Electrical system troubleshooting",
      "Suspension and steering repairs",
      "Cooling system service",
      "Computer diagnostic scanning"
    ]
  },
  {
    id: 3,
    title: "Body Shop & Painting",
    description: "Our fully-equipped body shop handles everything from minor dents to major collision damage. We restore your vehicle to its pre-accident condition with precision and care.",
    image: "/assets/images/img9.jpg",
    slug: "body-shop",
    features: [
      "Collision repair",
      "Dent removal",
      "Custom paint matching",
      "Frame straightening",
      "Rust repair and prevention",
      "Glass replacement and repair"
    ]
  },
  {
    id: 4,
    title: "Expert Care",
    description: "We stock a wide range of genuine and OEM parts for all major vehicle makes and models. Our parts department ensures you get the right components for your specific vehicle.",
    image: "/assets/images/img8.jpg",
    slug: "expert-care",
    features: [
      "Genuine manufacturer parts",
      "OEM and aftermarket options",
      "Performance parts",
      "Parts warranty",
      "Special order capabilities",
      "Competitive pricing"
    ]
  },
  {
    id: 5,
    title: "Accessories & Upgrades",
    description: "Personalize your vehicle with our selection of premium accessories and performance upgrades. Our installation experts ensure proper fitting and functionality.",
    image: "/assets/images/img2.jpg",
    slug: "accessories",
    features: [
      "Entertainment system upgrades",
      "Interior accessories and customization",
      "Exterior styling enhancements",
      "Performance upgrades",
      "Towing equipment",
      "Security systems"
    ]
  }
];

export default ServicesPage;