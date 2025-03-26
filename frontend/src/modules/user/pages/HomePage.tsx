import React from "react";
import HomeLayout from "../layout/HomeLayout";
import { Link } from "react-router-dom";
import carVideo from "../../../../public/assets/car1.mp4";

const HomePage: React.FC = () => {
  return (
    <HomeLayout>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
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

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
              PRABATH MOTORS & DISTRIBUTORS
            </h1>
            <h1 className="text-4xl md:text-3xl font-bold leading-tight mb-4 drop-shadow-lg">
              Your Trusted Partner for Vehicle Service & Repairs
            </h1>
            <p className="text-lg md:text-xl mb-8 drop-shadow-md">
              Experience top-quality automotive services with state-of-the-art
              facilities and expert technicians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link
                    to={`/services/${service.id}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img
                src="../../../../public/assets/images/img4.jpg"
                alt="Our workshop"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">About Prabath Motors</h2>
              <p className="text-gray-700 mb-4">
                With over 15 years of experience, Prabath Motors has established
                itself as a leader in automotive service excellence. Our
                state-of-the-art facility in Sri Lanka combines the latest
                technology with skilled technicians to deliver superior results.
              </p>
              <p className="text-gray-700 mb-6">
                We pride ourselves on transparency, quality workmanship, and
                customer satisfaction. Whether you need routine maintenance or
                complex repairs, we're committed to keeping your vehicle in
                optimal condition.
              </p>
              <Link
                to="/about"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 inline-block"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience Premium Service?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule an appointment today and let our expert team take care of
            your vehicle.
          </p>
          <Link
            to="/appointment"
            className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Find Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-700">
                123 Motor Avenue,
                <br /> Colombo, Sri Lanka
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-700">+94 123 456 789</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-700">info@prabathmotors.com</p>
            </div>
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
