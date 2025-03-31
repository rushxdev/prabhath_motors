import React from "react";
import HomeLayout from "../layout/HomeLayout";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  return (
    <HomeLayout>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-0"></div>
        <img
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60 z-0"
          src="../../../../public/assets/images/img7.avif"
          alt="Workshop"
        />

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
            Our Story
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
            Prabath Motors has been serving the automotive needs of Sri Lanka
            since 2005
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img
                src="../../../../public/assets/images/img5.jpg"
                alt="Our history"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
              <p className="text-gray-700 mb-4">
                Founded by Mr. Prabath Silva in 2005, we began as a small garage
                with just three employees and a passion for automotive
                excellence. What started as a modest repair shop has now grown
                into one of Sri Lanka's premier automotive service centers.
              </p>
              <p className="text-gray-700 mb-4">
                Throughout our journey, we've maintained our commitment to
                quality, integrity, and customer satisfaction. We've expanded
                our facilities, enhanced our technological capabilities, and
                built a team of certified technicians who share our passion.
              </p>
              <p className="text-gray-700">
                Today, Prabath Motors continues to evolve, adapting to the
                changing automotive landscape while staying true to our founding
                principles. Our growth has been driven by word-of-mouth from
                satisfied customers who trust us with their vehicles year after
                year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Mission & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-700">
                We strive for excellence in everything we do, from routine
                maintenance to complex repairs. Our technicians undergo regular
                training to stay ahead of industry developments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
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
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-gray-700">
                We believe in complete transparency with our customers. You'll
                always know what work is needed, why it's necessary, and exactly
                what you're paying for.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Reliability</h3>
              <p className="text-gray-700">
                When we make a promise, we keep it. We understand the importance
                of your vehicle and respect your time, which is why we commit to
                dependable service and timely completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {leadership.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-green-600 mb-3">{member.position}</p>
                  <p className="text-gray-700">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Facilities
          </h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <p className="text-gray-700 mb-6">
                Our state-of-the-art 15,000 square foot facility is equipped
                with the latest diagnostic tools and specialized equipment to
                handle everything from routine maintenance to complex repairs.
                We continuously invest in new technology to ensure we can
                service all makes and models efficiently.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Advanced diagnostic computers
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Modern alignment machines
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Air-conditioned customer lounge
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dedicated service bays
                </li>
              </ul>
              <p className="text-gray-700">
                Our facility is designed to provide comprehensive automotive
                services under one roof, making us your one-stop destination for
                all your vehicle needs.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="../../../../public/assets/images/facility1.jpg"
                  alt="Facility"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="../../../../public/assets/images/facility2.jpg"
                  alt="Facility"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="../../../../public/assets/images/facility3.jpg"
                  alt="Facility"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="../../../../public/assets/images/facility4.jpg"
                  alt="Facility"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Visit Our Workshop Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience our commitment to quality and customer service firsthand.
            Schedule a visit or bring your vehicle in for a service.
          </p>
          <Link
            to="/contact"
            className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
};

// Sample data for leadership team
const leadership = [
  {
    id: 1,
    name: "Prabath Silva",
    position: "Founder & CEO",
    description:
      "With over 25 years in the automotive industry, Prabath leads our team with passion and expertise.",
    image: "../../../../public/assets/images/leader1.jpg",
  },
  {
    id: 2,
    name: "Chamara Perera",
    position: "Operations Manager",
    description:
      "Chamara ensures our operations run smoothly and efficiently to deliver exceptional service.",
    image: "../../../../public/assets/images/leader2.jpg",
  },
  {
    id: 3,
    name: "Amali Fernando",
    position: "Customer Relations",
    description:
      "Amali oversees our customer experience, ensuring satisfaction at every touchpoint.",
    image: "../../../../public/assets/images/leader3.jpg",
  },
  {
    id: 4,
    name: "Dinesh Kumar",
    position: "Lead Technician",
    description:
      "With multiple certifications, Dinesh leads our technical team with precision and expertise.",
    image: "../../../../public/assets/images/leader4.jpg",
  },
];

export default AboutPage;
