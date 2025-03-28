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
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>
        {/* Search box */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Vehicle Reg. No</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Mileage</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointment.map((appointment) => (
              <tr key={appointment.id} className="text-center">
                <td className="border p-2">
                  {appointment.vehicleRegistrationNo}
                </td>
                <td className="border p-2">{appointment.date}</td>
                <td className="border p-2">{appointment.time}</td>
                <td className="border p-2">{appointment.mileage}</td>
                <td className="border p-2">
                <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() =>
                      navigate(`update-appointment/${appointment.id}`)
                    }
                  >
                    Assign Job
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() =>
                      navigate(`update-appointment/${appointment.id}`)
                    }
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleDelete(appointment.id!)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
};

export default AppointmentPage;
