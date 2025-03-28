import { useEffect, useState } from "react";
import { Appointment } from "../../../types/Appointment";
import {
  deleteAppointment,
  getAllAppointments,
} from "../../../services/appointmentService";
import Navbar from "../../user/components/Navbar";
import { useNavigate } from "react-router-dom";

const AppointmentPage = () => {
  const [appointment, setAppointment] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const data = await getAllAppointments();
    setAppointment(data);
  };

  useEffect(() => {
    fetchAppointments();
  });

  const handleDelete = async (id: number) => {
    await deleteAppointment(id);
    fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <Navbar />
  <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
      Appointments
    </h2>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border p-3">Vehicle Reg. No</th>
            <th className="border p-3">Date</th>
            <th className="border p-3">Time</th>
            <th className="border p-3">Mileage</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointment.map((appointment, index) => (
            <tr
              key={appointment.id}
              className={`text-center ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <td className="border p-3">{appointment.vehicleRegistrationNo}</td>
              <td className="border p-3">{appointment.date}</td>
              <td className="border p-3">{appointment.time}</td>
              <td className="border p-3">{appointment.mileage}</td>
              <td className="border p-3 space-x-2">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                  onClick={() => navigate(`update-appointment/${appointment.id}`)}
                >
                  Assign Job
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                  onClick={() => navigate(`update-appointment/${appointment.id}`)}
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleDelete(appointment.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
};

export default AppointmentPage;
