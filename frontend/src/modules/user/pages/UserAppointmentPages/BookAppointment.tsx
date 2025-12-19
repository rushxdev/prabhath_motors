import React, { useState /*, { useState } */ } from "react";
//import { Appointment } from "../../../../types/Appointment";
//import { addAppointment } from "../../../../services/appointmentService";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "../../../../hooks/useAppointment"; 
import Modal from "../../../../components/Model"; 
import AppointLayouts from "../../../admin/layout/AppointmentLayouts/AppointLayouts";

const BookAppointment = () => {
  const navigate = useNavigate();
  const {
    appointment,
    errors,
    handleChange,
    handleSubmit: handleAppointmentSubmit,
  } = useAppointment();
  const [isSubmitting] = useState(false); 
  const [isOpen, setIsOpen] = useState(true); 

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Handle modal close
  const handleClose = () => {
    setIsOpen(false);
    navigate("/admin/appointment-list"); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleAppointmentSubmit(e);
    if (result) {
      alert("Appointment booked successfully");
      navigate("/admin/appointment-list");
    }
  };

  return (
    <AppointLayouts>
    <div>
      <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Book Appointment"
    >
      <form onSubmit={handleSubmit} className="mt-4">
        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}

        {/* Vehicle Registration Number */}
        <div className="mb-6">
          <label
            htmlFor="vehicleRegistrationNo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vehicle Registration No.
          </label>
          <input
            type="text"
            id="vehicleRegistrationNo"
            name="vehicleRegistrationNo"
            value={appointment.vehicleRegistrationNo}
            onChange={handleChange}
            placeholder="Enter vehicle registration number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.vehicleRegistrationNo && (
            <p className="mt-1 text-sm text-red-600">
              {errors.vehicleRegistrationNo}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="mb-6">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Appointment Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={appointment.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Time */}
        <div className="mb-6">
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Appointment Time
          </label>
          <select
            id="time"
            name="time"
            value={appointment.time}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time}</p>
          )}
        </div>

        {/* Mileage */}
        <div className="mb-6">
          <label
            htmlFor="mileage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mileage
          </label>
          <input
            type="text"
            id="mileage"
            name="mileage"
            value={appointment.mileage}
            onChange={handleChange}
            placeholder="Enter current vehicle mileage"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.mileage && (
            <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end mt-8 gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-700 transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </form>
      </Modal>
    </div>
    </AppointLayouts>
  );
};

export default BookAppointment;
