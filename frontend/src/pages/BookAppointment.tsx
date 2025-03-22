import React, { useState } from "react";
import { Appointment } from "../types/Appointment";
import Navbar from "../modules/user/components/Navbar";
import { addAppointment } from "../services/appointmentService";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const [appointment, setAppointment] = useState<Appointment>({
    vehicleRegistrationNo: "",
    date: "",
    time: "",
    mileage: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await addAppointment({...appointment, mileage:parseFloat(appointment.mileage.toString())});
        alert("Appointment booked successfully");
        setAppointment({ vehicleRegistrationNo: "", date: "", time: "", mileage: 0 });
        navigate("/");
    } catch (error) {
        console.error("Error while booking appointment", error);
        alert("Failed to book appointment");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="vehicleRegistrationNo"
            placeholder="Vehicle Registration No."
            value={appointment.vehicleRegistrationNo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            value={appointment.date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="time"
            name="time"
            value={appointment.time}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={appointment.mileage}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
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
