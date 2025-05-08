import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleById, deleteVehicle, transferVehicleOwnership, getOwnershipHistory, clearOwnershipHistory } from "../../../../services/vehicleService";
import { Vehicle, OwnershipHistory } from "../../../../types/Vehicle";
import Navbar from "../../../user/components/Navbar";
import Sidebar from "../../components/Sidebar";
import jsPDF from "jspdf";

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [ownershipHistory, setOwnershipHistory] = useState<OwnershipHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: "",
    contact: ""
  });
  const navigate = useNavigate();

  // PDF Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: "Prabhath Motors",
    address: "Main Street, City",
    phone: "011-1234567"
  });
  const [qrText, setQrText] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Add state for temporary settings
  const [tempSettings, setTempSettings] = useState({
    companyDetails: {
      name: "Prabhath Motors",
      address: "Main Street, City",
      phone: "011-1234567"
    },
    qrText: "",
    logo: null as string | null
  });

  useEffect(() => {
    if (id) {
      getVehicleById(Number(id)).then((data) => {
        setVehicle(data);
        setLoading(false);
      });
      getOwnershipHistory(Number(id)).then((data) => {
        setOwnershipHistory(data);
      });
    }
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!isConfirmed || !vehicle?.id) return;
    
    try {
      // First clear ownership history
      await clearOwnershipHistory(vehicle.id);
      // Then delete the vehicle
    await deleteVehicle(vehicle.id);
    navigate("/vehicle-page");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle. Please try again.");
    }
  };

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle?.id) return;

    try {
      await transferVehicleOwnership(
        vehicle.id,
        newOwner.name,
        newOwner.contact
      );
      // Refresh vehicle and ownership history data
      const updatedVehicle = await getVehicleById(vehicle.id);
      const updatedHistory = await getOwnershipHistory(vehicle.id);
      setVehicle(updatedVehicle);
      setOwnershipHistory(updatedHistory);
      setShowTransferForm(false);
      setNewOwner({ name: "", contact: "" });
    } catch (error) {
      console.error("Error transferring ownership:", error);
      alert("Failed to transfer ownership. Please try again.");
    }
  };

  // Function to handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Function to generate the Next Service Due PDF (with settings)
  const handleGenerateServiceDuePDF = () => {
    // Read settings from localStorage (fallback to defaults)
    const defaultSettings = {
      companyDetails: {
        name: "Prabhath Motors",
        address: "Main Street, City",
        phone: "011-1234567"
      },
      qrText: "",
      logo: null as string | null
    };
    let settings = defaultSettings;
    const saved = localStorage.getItem('pdfSettings');
    if (saved) {
      try {
        settings = { ...defaultSettings, ...JSON.parse(saved) };
        settings.companyDetails = { ...defaultSettings.companyDetails, ...settings.companyDetails };
      } catch {}
    }
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Next Service Due", 20, y);
    y += 20;
    // Logo
    if (settings.logo) {
      doc.addImage(settings.logo, "PNG", 150, 10, 40, 20);
    }
    doc.setFontSize(12);
    doc.text(`Vehicle Number: ${vehicle?.vehicleRegistrationNo || "-"}`, 20, y); y += 10;
    doc.text(`Mileage: ${vehicle?.mileage || "-"}`, 20, y); y += 10;
    doc.text(`Service Center: ${settings.companyDetails.name}, ${settings.companyDetails.address}, ${settings.companyDetails.phone}`, 20, y); y += 10;
    // QR code placeholder (draw a box)
    if (settings.qrText) {
      doc.setDrawColor(0);
      doc.rect(20, y, 30, 30);
      doc.text("QR", 35, y + 17, { align: "center" });
      doc.setFontSize(10);
      doc.text("(QR code here)", 55, y + 17);
      y += 35;
    }
    doc.save(`Next_Service_Due_${vehicle?.vehicleRegistrationNo || "vehicle"}.pdf`);
  };

  // Function to handle settings save
  const handleSaveSettings = () => {
    setCompanyDetails(tempSettings.companyDetails);
    setQrText(tempSettings.qrText);
    setLogo(tempSettings.logo);
    setShowSettings(false);
  };

  // Function to handle settings cancel
  const handleCancelSettings = () => {
    setTempSettings({
      companyDetails: companyDetails,
      qrText: qrText,
      logo: logo
    });
    setShowSettings(false);
  };

  // Update tempSettings when modal opens
  useEffect(() => {
    if (showSettings) {
      setTempSettings({
        companyDetails: companyDetails,
        qrText: qrText,
        logo: logo
      });
    }
  }, [showSettings]);

  if (loading) return <div>Loading...</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-row bg-transparent" style={{background: 'linear-gradient(120deg, #f0f4ff 60%, #ede9fe 100%)'}}>
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-start py-10 px-2">
          <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-4 tracking-tight">Vehicle Details</h1>
          <div className="w-32 h-1 mx-auto mb-10 bg-gradient-to-r from-blue-500 to-violet-400 rounded-full"></div>
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl mb-8">
            <div className="flex items-center mb-8">
              <span className="text-2xl text-blue-600 mr-2"><i className="fa fa-car"></i></span>
              <h2 className="text-2xl font-semibold">Vehicle Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-lg mb-8">
              <div>
                <span className="block text-blue-600 font-semibold">Vehicle Reg. No</span>
                <span className="block font-bold text-xl">{vehicle.vehicleRegistrationNo}</span>
              </div>
              <div>
                <span className="block text-blue-600 font-semibold">Vehicle Type</span>
                <span className="block font-bold text-xl">{vehicle.vehicleType}</span>
              </div>
              <div>
                <span className="block text-blue-600 font-semibold">Owner Name</span>
                <span className="block font-bold text-lg">{vehicle.ownerName}</span>
              </div>
              <div>
                <span className="block text-blue-600 font-semibold">Contact No</span>
                <span className="block font-bold text-lg">{vehicle.contactNo}</span>
              </div>
              <div>
                <span className="block text-blue-600 font-semibold">Mileage</span>
                <span className="block font-bold">{vehicle.mileage}</span>
              </div>
              <div>
                <span className="block text-blue-600 font-semibold">Last Updated Time</span>
                <span className="block font-bold">{vehicle.lastUpdate}</span>
              </div>
          </div>
            <div className="flex flex-col md:flex-row gap-4 justify-start ml-2">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition" onClick={() => navigate(`/vehicle-page/vehicle-update/${vehicle.id}`)}>
                <i className="fa fa-pen"></i> Update
              </button>
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-500 hover:from-blue-700 hover:to-violet-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition" onClick={() => setShowTransferForm(!showTransferForm)}>
                <i className="fa fa-random"></i> Transfer Ownership
              </button>
              <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition" onClick={handleDelete}>
                <i className="fa fa-trash"></i> Remove
              </button>
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                onClick={handleGenerateServiceDuePDF}
              >
                <i className="fa fa-file-pdf-o"></i> Generate Next Service Due
              </button>
            </div>
          {showTransferForm && (
            <div className="mt-6 p-4 border rounded">
              <h3 className="text-xl font-semibold mb-4">Transfer Ownership</h3>
              <form onSubmit={handleTransferOwnership} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Owner Name</label>
                  <input
                    type="text"
                    value={newOwner.name}
                    onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Owner Contact</label>
                  <input
                    type="text"
                    value={newOwner.contact}
                    onChange={(e) => setNewOwner({ ...newOwner, contact: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Confirm Transfer
                </button>
              </form>
            </div>
          )}
        </div>
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center mb-4">
                <span className="text-xl text-blue-600 mr-2"><i className="fa fa-history"></i></span>
                <h3 className="text-xl font-semibold">Ownership History</h3>
            {ownershipHistory.length > 0 && (
              <button
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow transition ml-4"
                onClick={async () => {
                  if (!vehicle?.id) return;
                  if (window.confirm("Are you sure you want to clear all ownership history?")) {
                    await clearOwnershipHistory(vehicle.id);
                    setOwnershipHistory([]);
                  }
                }}
              >
                    <i className="fa fa-trash"></i> Clear All Records
              </button>
            )}
          </div>
          {ownershipHistory.length === 0 ? (
                <p className="text-gray-400 italic">No ownership history available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Owner</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ownershipHistory.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.transferDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.previousOwnerName} ({record.previousOwnerContact})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.newOwnerName} ({record.newOwnerContact})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <span className="text-xl text-blue-600 mr-2"><i className="fa fa-tools"></i></span>
                <h3 className="text-xl font-semibold">Service History</h3>
              </div>
              <p className="text-gray-400 italic">No service history available</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetails; 