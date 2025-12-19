import React from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import HomeLayout from "../layout/HomeLayout";

const SupportPage = () => {
  // Animation setup
  const headerAnimation = useAnimationSection();
  const faqAnimation = useAnimationSection();
  const contactAnimation = useAnimationSection();
  const resourcesAnimation = useAnimationSection();
  
  // Animation variants
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
          src="/assets/images/support.jpg"
          alt="Support Header"
        />
        
        {/* Content Overlay */}
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-center drop-shadow-lg"
            initial="hidden"
            animate={headerAnimation.controls}
            variants={titleVariant}
          >
            Customer Support
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto text-center drop-shadow-md"
            initial="hidden"
            animate={headerAnimation.controls}
            variants={paragraphVariant}
          >
            We're here to help with any questions or concerns about your vehicle service and repair needs.
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white" ref={faqAnimation.ref}>
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            initial="hidden"
            animate={faqAnimation.controls}
            variants={titleVariant}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={faq.id}
                className="mb-6 border-b border-gray-200 pb-6 last:border-0"
                initial="hidden"
                animate={faqAnimation.controls}
                variants={cardVariant}
                custom={index}
              >
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels Section */}
      <section className="py-16 bg-gray-100" ref={contactAnimation.ref}>
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            initial="hidden"
            animate={contactAnimation.controls}
            variants={titleVariant}
          >
            Contact Support
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {supportChannels.map((channel, index) => (
              <motion.div 
                key={channel.id}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
                initial="hidden"
                animate={contactAnimation.controls}
                variants={cardVariant}
                custom={index}
              >
                <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{channel.title}</h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                <div className="font-semibold text-green-600">{channel.contact}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white" ref={resourcesAnimation.ref}>
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            initial="hidden"
            animate={resourcesAnimation.controls}
            variants={titleVariant}
          >
            Helpful Resources
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {resources.map((resource, index) => (
              <motion.div 
                key={resource.id}
                className="bg-gray-50 rounded-lg shadow-md overflow-hidden"
                initial="hidden"
                animate={resourcesAnimation.controls}
                variants={cardVariant}
                custom={index}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={resource.image} 
                    alt={resource.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <Link 
                    to={resource.link} 
                    className="text-green-600 font-semibold hover:text-green-700"
                  >
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white relative overflow-hidden group">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 
                       bg-gradient-to-t from-green-600/50 via-green-600/25 to-transparent 
                       rounded-50 opacity-0 
                       transition-all duration-700 ease-out 
                       group-hover:w-[200%] group-hover:h-full group-hover:opacity-100"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our support team is always ready to assist you with any questions or concerns.
          </p>
          <Link
            to=""
            className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
};

// Custom animation hook
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

// FAQ data
const faqs = [
  {
    id: 1,
    question: "How often should I service my vehicle?",
    answer: "We recommend following your vehicle manufacturer's service schedule, typically every 10,000-15,000 kilometers or every 6-12 months, whichever comes first. Regular maintenance helps prevent costly repairs and extends your vehicle's lifespan."
  },
  {
    id: 2,
    question: "How long does a typical service appointment take?",
    answer: "A standard service typically takes 2-3 hours, while more complex repairs may take longer. We always provide an estimated completion time when you book your appointment and keep you updated on progress."
  },
  {
    id: 3,
    question: "Do you provide warranty on repairs?",
    answer: "Yes, we offer a 12-month/20,000 kilometer warranty on all parts and labor. If you experience any issues related to our service within this period, we'll address them at no additional cost."
  },
  {
    id: 4,
    question: "Can I get a courtesy vehicle while mine is being serviced?",
    answer: "Yes, we offer courtesy vehicles subject to availability. These should be reserved in advance when booking your appointment. We also provide a complimentary shuttle service within a 10km radius."
  },
  {
    id: 5,
    question: "How do I check the status of my vehicle repair?",
    answer: "You can check your vehicle's service status through our online portal or by calling our customer service line. We also send SMS updates at key stages of the repair process."
  }
];

// Support channels data
const supportChannels = [
  {
    id: 1,
    title: "Phone Support",
    description: "Speak directly with our support team for immediate assistance with your inquiries.",
    contact: "+94 76 190 3423",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Email Support",
    description: "Send us your questions anytime. We typically respond within 24 hours.",
    contact: "support@prabathmotors.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Visit Workshop",
    description: "Come to our service center for face-to-face assistance with any concerns.",
    contact: "Mon-Sat: 8AM - 6PM",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

// Resources data
const resources = [
  {
    id: 1,
    title: "Vehicle Maintenance Guide",
    description: "Learn essential tips for keeping your vehicle in optimal condition and extending its lifespan.",
    image: "../../../../public/assets/images/img1.jpg",
    link: "https://www.youtube.com/watch?v=25-HG471MIc"
  },
  {
    id: 2,
    title: "Understanding Warning Lights",
    description: "A comprehensive guide to dashboard warning lights and what action you should take.",
    image: "../../../../public/assets/images/img7.jpg",
    link: "https://www.youtube.com/watch?v=pwQUpLdCQ6g"
  },
  {
    id: 3,
    title: "Emergency Roadside Tips",
    description: "Practical advice for handling common roadside emergencies until help arrives.",
    image: "../../../../public/assets/images/img10.jpg",
    link: "https://www.youtube.com/watch?v=NpIgWQPDOJ8"
  }
];

export default SupportPage;