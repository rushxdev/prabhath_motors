import { useEffect, useState, useRef } from "react";
import { Vehicle } from "../../../../types/Vehicle";
import { deleteVehicle, getAllVehicles } from "../../../../services/vehicleService";
import Navbar from "../../../user/components/Navbar";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow, parse } from "date-fns";

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // PDF Settings State
  const [showSettings, setShowSettings] = useState(false);
  const defaultSettings = {
    companyDetails: {
      name: "Prabhath Motors",
      address: "Main Street, City",
      phone: "011-1234567"
    },
    qrText: "",
    logo: null as string | null
  };
  const [companyDetails, setCompanyDetails] = useState(defaultSettings.companyDetails);
  const [qrText, setQrText] = useState(defaultSettings.qrText);
  const [logo, setLogo] = useState<string | null>(defaultSettings.logo);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [tempSettings, setTempSettings] = useState(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pdfSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompanyDetails(parsed.companyDetails || defaultSettings.companyDetails);
      setQrText(parsed.qrText || defaultSettings.qrText);
      setLogo(parsed.logo || defaultSettings.logo);
    }
  }, []);

  const fetchVehicles = async () => {
    const data = await getAllVehicles();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!isConfirmed) return;

    await deleteVehicle(id);
    fetchVehicles();
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleRegistrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle settings save
  const handleSaveSettings = () => {
    setCompanyDetails(tempSettings.companyDetails);
    setQrText(tempSettings.qrText);
    setLogo(tempSettings.logo);
    // Save to localStorage
    localStorage.setItem('pdfSettings', JSON.stringify(tempSettings));
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

  return (
    <div>
      <div className="w-full mx-auto text-center mb-12 sm:mb-160">
        <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">Manage All Vehicles</h2>

        {/* Container for Search bar and Add New button */}
        <div className="flex items-center justify-between mt-12">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
          />
          {/* Add New button and Settings button */}
          <div className="flex items-center ml-4 gap-2">
            <button
              onClick={() => navigate(`/admin/vehicle-page/vehicle-registration`)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Vehicle
            </button>
            {/*
            <button
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow transition"
              onClick={() => setShowSettings(true)}
            >
              <i className="fa fa-cog"></i> Settings
            </button>
            */}
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Reg. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage/KM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.vehicleRegistrationNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.vehicleType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.ownerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.contactNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.mileage}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Show relative time for lastUpdate */}
                      {(() => {
                        if (!vehicle.lastUpdate) return "-";
                        // Parse lastUpdate as today's time (HH:mm:ss or HH:mm)
                        const now = new Date();
                        const [h, m, s] = vehicle.lastUpdate.split(":");
                        const lastUpdateDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m), Number(s || 0));
                        return formatDistanceToNow(lastUpdateDate, { addSuffix: true });
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:underline px-3 py-1 rounded mr-2"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/admin/vehicle-page/${vehicle.id}`);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleCancelSettings}>
                <i className="fa fa-times"></i>
              </button>
              <h2 className="text-2xl font-bold mb-4">PDF Settings</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={tempSettings.companyDetails.name}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      companyDetails: { ...tempSettings.companyDetails, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={tempSettings.companyDetails.address}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      companyDetails: { ...tempSettings.companyDetails, address: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={tempSettings.companyDetails.phone}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      companyDetails: { ...tempSettings.companyDetails, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setTempSettings({
                          ...tempSettings,
                          logo: ev.target?.result as string
                        });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full border rounded p-2"
                  />
                  {tempSettings.logo && <img src={tempSettings.logo} alt="Logo Preview" className="mt-2 h-12" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">QR Code Text</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={tempSettings.qrText}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      qrText: e.target.value
                    })}
                    placeholder="e.g. https://yourcompany.com"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancelSettings}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VehiclePage;
