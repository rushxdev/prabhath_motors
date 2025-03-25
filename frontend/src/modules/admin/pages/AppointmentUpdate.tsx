import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointmentById,
  updateAppointment,
} from "../../../services/appointmentService";
import Navbar from "../../user/components/Navbar";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div>
    <Navbar />
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Update Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="vehicleRegistrationNo"
          placeholder="Vehicle Registration No."
          value={appointment.vehicleRegistrationNo}
          onChange={handleChange}
          readOnly
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
          readOnly
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Reschedule Appointment
        </button>
      </form>
    </div>
  </div>
  );
};

export default AppointmentUpdate;
