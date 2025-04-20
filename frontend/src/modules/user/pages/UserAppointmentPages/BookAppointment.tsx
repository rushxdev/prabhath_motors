import React, { useState } from "react";
import { Appointment } from "../../../../types/Appointment";
import Navbar from "../../components/Navbar";
import { addAppointment } from "../../../../services/appointmentService";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "../../../hooks/useAppointment"; // Adjust import path as needed

const BookAppointment = () => {
  const navigate = useNavigate();
  const { appointment, errors, handleChange, handleSubmit: handleAppointmentSubmit } = useAppointment();

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleAppointmentSubmit(e);
    if (result) {
      alert("Appointment booked successfully");
      navigate("/admin/appointment-list");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="vehicleRegistrationNo"
              placeholder="Vehicle Registration No."
              value={appointment.vehicleRegistrationNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.vehicleRegistrationNo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicleRegistrationNo}
              </p>
            )}
          </div>
          
          <div>
            <input
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <select
            name="time"
            value={appointment.time}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <div>
            <input
              type="text"
              name="mileage"
              placeholder="Mileage"
              value={appointment.mileage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.mileage && (
              <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;