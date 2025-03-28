import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointmentById,
  updateAppointment,
} from "../../../services/appointmentService";
import Navbar from "../../user/components/Navbar";

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

const AppointmentUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    vehicleRegistrationNo: "",
    date: "",
    time: "",
    mileage: 0,
  });

  useEffect(() => {
    if (id) {
      fetchAppointmentData(id);
    }
  }, [id]);

  const fetchAppointmentData = async (appointmentId: string) => {
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
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      console.error("apponitment id is undefined");
      return;
    }

    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      console.error("Invalid appointment id");
      return;
    }

    try {
      await updateAppointment(idNumber, appointment);
      navigate("/appointment-list");
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
      <input
        type="text"
        name="vehicleRegistrationNo"
        placeholder="Vehicle Registration No."
        value={appointment.vehicleRegistrationNo}
        onChange={handleChange}
        readOnly
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
      />
      <input
        type="date"
        name="date"
        value={appointment.date}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
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
      <input
        type="number"
        name="mileage"
        placeholder="Mileage"
        value={appointment.mileage}
        onChange={handleChange}
        readOnly
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
      />
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
