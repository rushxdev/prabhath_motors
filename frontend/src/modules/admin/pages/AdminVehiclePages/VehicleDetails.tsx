import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleById, deleteVehicle, transferVehicleOwnership, getOwnershipHistory, clearOwnershipHistory } from "../../../../services/vehicleService";
import { Vehicle, OwnershipHistory } from "../../../../types/Vehicle";
import jsPDF from "jspdf";
import { formatDistanceToNow } from "date-fns";
import { PDFViewer } from '@react-pdf/renderer';
import VehicleReport from '../../components/Reports/VehicleReport';

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

  const [showReport, setShowReport] = useState(false);

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
    navigate("/admin/vehicle-page");
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
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-2">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary w-full text-center">Vehicle Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
            <div className="space-y-2">
              <div><span className="text-gray-500">Registration No</span><div className="text-green-700 font-semibold text-lg">{vehicle?.vehicleRegistrationNo}</div></div>
              <div><span className="text-gray-500">Type</span><div className="text-green-700 font-semibold text-lg">{vehicle?.vehicleType}</div></div>
            </div>
          </div>
          {/* Identification */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Identification</h3>
            <div className="space-y-2">
              <div><span className="text-gray-500">Owner Name</span><div className="text-green-700 font-semibold text-lg">{vehicle?.ownerName}</div></div>
              <div><span className="text-gray-500">Contact No</span><div className="text-green-700 font-semibold text-lg">{vehicle?.contactNo}</div></div>
            </div>
          </div>
          {/* Status/Stock */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Status</h3>
            <div className="space-y-2">
              <div><span className="text-gray-500">Mileage</span><div className="text-green-700 font-semibold text-lg">{vehicle?.mileage} KM</div></div>
              <div><span className="text-gray-500">Last Updated Time</span>
                <div className="text-green-700 font-semibold text-lg">
                  {(() => {
                    if (!vehicle?.lastUpdate) return "-";
                    const now = new Date();
                    const [h, m, s] = vehicle.lastUpdate.split(":");
                    const lastUpdateDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m), Number(s || 0));
                    return formatDistanceToNow(lastUpdateDate, { addSuffix: true });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>
        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-y-6 md:gap-x-12 justify-center items-center mb-8">
          <button className="min-w-[120px] h-11 flex items-center justify-center rounded-full border-2 border-blue-300 text-blue-600 bg-white font-medium text-base shadow-sm hover:bg-blue-50 transition-all duration-200" onClick={() => navigate(`/admin/vehicle-page/vehicle-update/${vehicle?.id}`)}>
            Update
          </button>
          <button className="min-w-[160px] h-11 flex items-center justify-center rounded-full border-2 border-violet-300 text-violet-600 bg-white font-medium text-base shadow-sm hover:bg-violet-50 transition-all duration-200" onClick={() => setShowTransferForm(!showTransferForm)}>
            Transfer Ownership
          </button>
          <button className="min-w-[120px] h-11 flex items-center justify-center rounded-full border-2 border-red-300 text-red-600 bg-white font-medium text-base shadow-sm hover:bg-red-50 transition-all duration-200" onClick={handleDelete}>
            Remove
          </button>
          <button className="min-w-[120px] h-11 flex items-center justify-center rounded-full border-2 border-green-300 text-green-700 bg-white font-medium text-base shadow-sm hover:bg-green-50 transition-all duration-200 text-center" onClick={() => setShowReport(true)}>
            Report
          </button>
          <button className="min-w-[120px] h-11 flex items-center justify-center rounded-full border-2 border-emerald-300 text-emerald-700 bg-white font-medium text-base shadow-sm hover:bg-emerald-50 transition-all duration-200" onClick={() => navigate("/admin/job-form", { state: { vehicleId: vehicle?.id } })}>
            Assign Job
          </button>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>
        {/* Transfer Ownership Form */}
        {showTransferForm && (
          <div className="mt-6 p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Transfer Ownership</h3>
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
                className="px-5 py-2 rounded-full bg-emerald-500 text-white font-semibold shadow-sm hover:bg-emerald-600 transition"
              >
                Confirm Transfer
              </button>
            </form>
          </div>
        )}
        {/* Ownership History */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 mt-8 border border-gray-100">
          <div className="flex items-center mb-4">
            <span className="text-xl text-blue-600 mr-2"><i className="fa fa-history"></i></span>
            <h3 className="text-xl font-semibold">Ownership History</h3>
            {ownershipHistory.length > 0 && (
              <button
                className="ml-4 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 font-semibold shadow-sm hover:bg-red-100 transition flex items-center gap-2"
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
        {/* Service History */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-4">
            <span className="text-xl text-blue-600 mr-2"><i className="fa fa-tools"></i></span>
            <h3 className="text-xl font-semibold">Service History</h3>
          </div>
          <p className="text-gray-400 italic">No service history available</p>
        </div>
        {/* PDF Viewer Modal */}
        {showReport && vehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl relative">
              <button
                onClick={() => setShowReport(false)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Close
              </button>
              <div className="h-[80vh] w-full mt-4">
                <PDFViewer width="100%" height="100%">
                  <VehicleReport vehicle={vehicle} />
                </PDFViewer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails; 