import { useEffect, useState } from "react";
import { Appointment } from "../../../types/Appointment";
import {
  deleteAppointment,
  getAllAppointments,
} from "../../../services/appointmentService";

import { useNavigate } from "react-router-dom";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const data = await getAllAppointments();
    setAppointments(data);
    setFilteredAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteAppointment(id);
    fetchAppointments();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = appointments.filter(appointment => 
      appointment.vehicleRegistrationNo.toLowerCase().includes(value)
    );

    setFilteredAppointments(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(`book-appointment`)}
        className="absolute top-25 right-60 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition"
      >
        Add Appointment
      </button>

      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Appointments
        </h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search by Vehicle Registration Number" 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-3">Vehicle Reg. No</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Time</th>
                <th className="border p-3">Mileage</th>
                <th className="border p-3">Owner</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment, index) => (
                <tr
                  key={appointment.id}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="border p-3">
                    {appointment.vehicleRegistrationNo}
                  </td>
                  <td className="border p-3">{appointment.date}</td>
                  <td className="border p-3">{appointment.time}</td>
                  <td className="border p-3">{appointment.mileage}</td>
                  <td className="border p-3">{appointment.owner}</td>
                  <td className="border p-3 space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                      onClick={() =>
                        navigate(`update-appointment/${appointment.id}`)
                      }
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

          <button className="absolute bottom-10 right-60 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition">TEST</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;