// src/components/forms/UtilityBillForm.tsx

import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../../../../components/Model"; // Import the Modal component

// Configure axios base URL
axios.defaults.baseURL = "http://localhost:8080";

// Define the UtilityBill interface based on backend entity
interface UtilityBill {
  id?: number;
  Billing_Acc_No: number;
  Type: string;
  Address: string;
  Meter_No: string;
  Unit_Price: number;
}

// For input masking of water billing account number
interface WaterBillingGroups {
  group1: string;
  group2: string;
  group3: string;
  group4: string;
  group5: string;
}

// For input masking of electricity billing account number
interface ElectricityBillingGroups {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  digit10: string;
}

interface FormValues {
  Type: string;
  Address: string;
  Meter_No: string;
  Unit_Price: string;
  Billing_Acc_No?: string;
}

const UtilityBillForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [isOpen, setIsOpen] = useState(true); // Modal state

  const [formValues, setFormValues] = useState<FormValues>({
    Type: "Electricity",
    Address: "",
    Meter_No: "",
    Unit_Price: "",
    Billing_Acc_No: "",
  });

  const [billingType, setBillingType] = useState<"Electricity" | "Water">(
    "Electricity"
  );
  const [waterBillingGroups, setWaterBillingGroups] =
    useState<WaterBillingGroups>({
      group1: "",
      group2: "",
      group3: "",
      group4: "",
      group5: "",
    });

  const [electricityBillingDigits, setElectricityBillingDigits] =
    useState<ElectricityBillingGroups>({
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
      digit7: "",
      digit8: "",
      digit9: "",
      digit10: "",
    });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Same existing functionality (fetch, validate, handle changes, submit)
  // Fetch utility bill data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchUtilityBill = async () => {
        try {
          const response = await axios.get(`/utilitybill/get/${id}`);
          const utilityBill = response.data;

          setFormValues({
            Type: utilityBill.Type,
            Address: utilityBill.Address,
            Meter_No: utilityBill.Meter_No,
            Unit_Price: utilityBill.Unit_Price.toString(),
            ...(utilityBill.Type === "Electricity" && {
              Billing_Acc_No: utilityBill.Billing_Acc_No.toString(),
            }),
          });

          setBillingType(utilityBill.Type as "Electricity" | "Water");

          // If water bill, break down the account number into groups
          if (utilityBill.Type === "Water") {
            const accNoStr = String(utilityBill.Billing_Acc_No).padStart(
              12,
              "0"
            );
            setWaterBillingGroups({
              group1: accNoStr.substring(0, 2),
              group2: accNoStr.substring(2, 4),
              group3: accNoStr.substring(4, 7),
              group4: accNoStr.substring(7, 10),
              group5: accNoStr.substring(10, 12),
            });
          }
          // If electricity bill, break down the account number into digits
          if (utilityBill.Type === "Electricity") {
            const accNoStr = String(utilityBill.Billing_Acc_No).padStart(
              10,
              "0"
            );
            setElectricityBillingDigits({
              digit1: accNoStr[0],
              digit2: accNoStr[1],
              digit3: accNoStr[2],
              digit4: accNoStr[3],
              digit5: accNoStr[4],
              digit6: accNoStr[5],
              digit7: accNoStr[6],
              digit8: accNoStr[7],
              digit9: accNoStr[8],
              digit10: accNoStr[9],
            });
          }
        } catch (error) {
          toast.error("Failed to fetch utility bill data");
          console.error("Error fetching utility bill:", error);
        }
      };

      fetchUtilityBill();
    }
  }, [isEditMode, id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate Type
    if (!formValues.Type) {
      newErrors.Type = "Billing type is required";
    }

    // Validate Address
    if (!formValues.Address.trim()) {
      newErrors.Address = "Address is required";
    }

    // Validate Meter Number
    if (!formValues.Meter_No) {
      newErrors.Meter_No = "Meter number is required";
    } else if (billingType === "Water") {
      if (!/^\d{9,10}$/.test(formValues.Meter_No)) {
        newErrors.Meter_No = "Water meter number must be 9-10 digits";
      }
    } else {
      // Electricity
      if (!/^[A-Za-z]\d{7}$/.test(formValues.Meter_No)) {
        newErrors.Meter_No =
          "Electricity meter number must be 1 letter followed by 7 digits";
      }
    }

    // Validate Unit Price
    if (!formValues.Unit_Price) {
      newErrors.Unit_Price = "Unit price is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formValues.Unit_Price)) {
      newErrors.Unit_Price = "Please enter a valid price (e.g. 12.34)";
    }

    // Validate Billing Account Number for Electricity
    if (billingType === "Electricity") {
      const allDigitsFilled = Object.values(electricityBillingDigits).every(
        (digit) => digit !== ""
      );
      if (!allDigitsFilled) {
        newErrors.electricityBillingDigits = "Please complete all 10 digits";
      }
    }

    // Validate Water Billing Groups
    if (billingType === "Water") {
      if (
        waterBillingGroups.group1.length !== 2 ||
        waterBillingGroups.group2.length !== 2 ||
        waterBillingGroups.group3.length !== 3 ||
        waterBillingGroups.group4.length !== 3 ||
        waterBillingGroups.group5.length !== 2
      ) {
        newErrors.waterBillingGroups =
          "Please complete all fields with the correct number of digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for Meter_No in Water billing type
    if (name === "Meter_No" && billingType === "Water") {
      // Only allow digits for water meter numbers
      const digitsOnly = value.replace(/\D/g, "");
      setFormValues((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle billing type change
  const handleBillingTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value as "Electricity" | "Water";
    setBillingType(type);
    setFormValues((prev) => ({
      ...prev,
      Type: type,
      Billing_Acc_No: "",
      // Reset Meter_No when switching billing types to avoid validation errors
      Meter_No: "",
    }));

    // Clear all errors when switching billing types
    setErrors({});

    if (type === "Water") {
      setWaterBillingGroups({
        group1: "",
        group2: "",
        group3: "",
        group4: "",
        group5: "",
      });
    } else {
      // Reset electricity digits when switching to Electricity
      setElectricityBillingDigits({
        digit1: "",
        digit2: "",
        digit3: "",
        digit4: "",
        digit5: "",
        digit6: "",
        digit7: "",
        digit8: "",
        digit9: "",
        digit10: "",
      });
    }
  };

  // Handle water billing account number group changes
  const handleWaterGroupChange = (
    groupName: keyof WaterBillingGroups,
    value: string
  ) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");

    // Get the max length for each group
    const maxLength = {
      group1: 2,
      group2: 2,
      group3: 3,
      group4: 3,
      group5: 2,
    }[groupName];

    // Truncate if longer than max length
    const truncated = digitsOnly.substring(0, maxLength);

    setWaterBillingGroups((prev) => ({
      ...prev,
      [groupName]: truncated,
    }));

    // Auto-focus next input if current one is filled to max length
    if (digitsOnly.length >= maxLength) {
      const nextGroupMap: Record<string, keyof WaterBillingGroups | null> = {
        group1: "group2",
        group2: "group3",
        group3: "group4",
        group4: "group5",
        group5: null,
      };

      const nextGroup = nextGroupMap[groupName];
      if (nextGroup) {
        const nextInput = document.getElementById(`water-billing-${nextGroup}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // Handle electricity billing account number digit changes
  const handleElectricityDigitChange = (
    digitName: keyof ElectricityBillingGroups,
    value: string
  ) => {
    // Only allow digits
    const digitOnly = value.replace(/\D/g, "");

    // Only set the first digit
    const singleDigit = digitOnly.substring(0, 1);

    setElectricityBillingDigits((prev) => ({
      ...prev,
      [digitName]: singleDigit,
    }));

    // Auto-focus next input if current one is filled
    if (digitOnly.length > 0) {
      const digitNumber = parseInt(digitName.replace("digit", ""), 10);
      if (digitNumber < 10) {
        const nextDigit = `digit${
          digitNumber + 1
        }` as keyof ElectricityBillingGroups;
        const nextInput = document.getElementById(
          `electricity-billing-${nextDigit}`
        );
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let billingAccNo: number;

      // Process billing account number based on type
      if (billingType === "Water") {
        const combinedNumber = `${waterBillingGroups.group1}${waterBillingGroups.group2}${waterBillingGroups.group3}${waterBillingGroups.group4}${waterBillingGroups.group5}`;
        billingAccNo = parseInt(combinedNumber, 10);
      } else {
        // For electricity
        const combinedNumber = Object.values(electricityBillingDigits).join("");
        billingAccNo = parseInt(combinedNumber, 10);
      }

      const utilityBillData = {
        ...(isEditMode && { id: parseInt(id as string) }),
        billing_Acc_No: billingAccNo,
        type: formValues.Type,
        address: formValues.Address,
        meter_No: formValues.Meter_No,
        unit_Price: parseFloat(formValues.Unit_Price),
      };

      if (isEditMode) {
        await axios.put("/utilitybill/update", utilityBillData);
        toast.success("Utility bill updated successfully");
      } else {
        await axios.post("/utilitybill/save", utilityBillData);
        toast.success("Utility bill saved successfully");
      }

      navigate("/admin/utility");
    } catch (error) {
      toast.error("Error saving utility bill");
      console.error("Error saving utility bill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setIsOpen(false);
    navigate("/admin/utility");
  };

  // Render using the Modal component
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Utility Bill" : "New Utility Bill"}
    >
      <form onSubmit={handleSubmit} className="mt-4">
        {/* Billing Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Type
          </label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <label
              className={`flex-1 text-center py-2 cursor-pointer ${
                billingType === "Electricity"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="Type"
                value="Electricity"
                checked={billingType === "Electricity"}
                onChange={handleBillingTypeChange}
                className="sr-only"
              />
              Electricity
            </label>
            <label
              className={`flex-1 text-center py-2 cursor-pointer ${
                billingType === "Water"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="Type"
                value="Water"
                checked={billingType === "Water"}
                onChange={handleBillingTypeChange}
                className="sr-only"
              />
              Water
            </label>
          </div>
          {errors.Type && (
            <p className="mt-1 text-sm text-red-600">{errors.Type}</p>
          )}
        </div>

        {/* Billing Account Number - Different based on type */}
        {billingType === "Electricity" ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Account Number
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {Array.from({ length: 10 }).map((_, index) => {
                const digitName = `digit${
                  index + 1
                }` as keyof ElectricityBillingGroups;
                return (
                  <React.Fragment key={digitName}>
                    <input
                      id={`electricity-billing-${digitName}`}
                      value={electricityBillingDigits[digitName]}
                      onChange={(e) =>
                        handleElectricityDigitChange(digitName, e.target.value)
                      }
                      placeholder="X"
                      maxLength={1}
                      className="w-10 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index < 9 && index % 3 === 2 && (
                      <span className="text-gray-500">-</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {errors.electricityBillingDigits && (
              <p className="mt-1 text-sm text-red-600">
                {errors.electricityBillingDigits}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Account Number
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                id="water-billing-group1"
                value={waterBillingGroups.group1}
                onChange={(e) =>
                  handleWaterGroupChange("group1", e.target.value)
                }
                placeholder="XX"
                maxLength={2}
                className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                id="water-billing-group2"
                value={waterBillingGroups.group2}
                onChange={(e) =>
                  handleWaterGroupChange("group2", e.target.value)
                }
                placeholder="XX"
                maxLength={2}
                className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                id="water-billing-group3"
                value={waterBillingGroups.group3}
                onChange={(e) =>
                  handleWaterGroupChange("group3", e.target.value)
                }
                placeholder="XXX"
                maxLength={3}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                id="water-billing-group4"
                value={waterBillingGroups.group4}
                onChange={(e) =>
                  handleWaterGroupChange("group4", e.target.value)
                }
                placeholder="XXX"
                maxLength={3}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                id="water-billing-group5"
                value={waterBillingGroups.group5}
                onChange={(e) =>
                  handleWaterGroupChange("group5", e.target.value)
                }
                placeholder="XX"
                maxLength={2}
                className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.waterBillingGroups && (
              <p className="mt-1 text-sm text-red-600">
                {errors.waterBillingGroups}
              </p>
            )}
          </div>
        )}

        {/* Meter Number */}
        <div className="mb-6">
          <label
            htmlFor="Meter_No"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Meter Number
          </label>
          <input
            type="text"
            id="Meter_No"
            name="Meter_No"
            value={formValues.Meter_No}
            onChange={handleInputChange}
            placeholder={
              billingType === "Water"
                ? "Enter 9-10 digit meter number"
                : "Enter meter number (e.g. A1234567)"
            }
            maxLength={billingType === "Water" ? 10 : 8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.Meter_No && (
            <p className="mt-1 text-sm text-red-600">{errors.Meter_No}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-6">
          <label
            htmlFor="Address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Address
          </label>
          <textarea
            id="Address"
            name="Address"
            value={formValues.Address}
            onChange={handleInputChange}
            placeholder="Enter utility bill address"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.Address && (
            <p className="mt-1 text-sm text-red-600">{errors.Address}</p>
          )}
        </div>

        {/* Unit Price */}
        <div className="mb-6">
          <label
            htmlFor="Unit_Price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Unit Price
          </label>
          <input
            type="number"
            id="Unit_Price"
            name="Unit_Price"
            value={formValues.Unit_Price}
            onChange={handleInputChange}
            placeholder="Enter unit price"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.Unit_Price && (
            <p className="mt-1 text-sm text-red-600">{errors.Unit_Price}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end mt-8 gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={
              isSubmitting ||
              (billingType === "Water" &&
                (waterBillingGroups.group1.length !== 2 ||
                  waterBillingGroups.group2.length !== 2 ||
                  waterBillingGroups.group3.length !== 3 ||
                  waterBillingGroups.group4.length !== 3 ||
                  waterBillingGroups.group5.length !== 2))
            }
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UtilityBillForm;
