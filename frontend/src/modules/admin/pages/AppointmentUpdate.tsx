import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointmentById,
  updateAppointment,
} from "../../../services/appointmentService";
import Navbar from "../../user/components/Navbar";
import { useAppointment } from "../../../hooks/useAppointment"; // Adjust import path as needed

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

const AppointmentUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { appointment, setAppointment, errors, handleChange, validateForm } = useAppointment();

  const fetchAppointmentData = React.useCallback(async (appointmentId: string) => {
    try {
      const idNumber = parseInt(appointmentId, 10);
      if (isNaN(idNumber)) {
        console.error("Invalid appointment id");
        return;
      }
      const data = await getAppointmentById(idNumber);
      setAppointment(data);
    } catch (error) {
      console.error("Error while fetching appointment", error);
    }
  }, [setAppointment]);

  useEffect(() => {
    if (id) {
      fetchAppointmentData(id);
    }
  }, [id, fetchAppointmentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      console.error("Appointment id is undefined");
      return;
    }

    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      console.error("Invalid appointment id");
      return;
    }

    if (!validateForm()) return;

    try {
      await updateAppointment(idNumber, appointment);
      navigate("/admin/appointment-list");
    } catch (error) {
      console.error("Error while updating appointment", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Update Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="vehicleRegistrationNo"
              placeholder="Vehicle Registration No."
              value={appointment.vehicleRegistrationNo}
              onChange={handleChange}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
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
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">{appointment.time}</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          
          <div>
            <input
              type="number"
              name="mileage"
              placeholder="Mileage"
              value={appointment.mileage}
              onChange={handleChange}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
            {errors.mileage && (
              <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium p-3 rounded-lg transition duration-300"
          >
            Reschedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentUpdate;