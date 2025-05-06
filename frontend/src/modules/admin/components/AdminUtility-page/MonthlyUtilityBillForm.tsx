import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../../../../components/Model"; // Import the Modal component

// Configure axios base URL
axios.defaults.baseURL = "http://localhost:8080";

interface MonthlyUtilityBill {
  id?: number;
  invoiceNo: number;
  billingAccNo: number;
  billingMonth: string;
  billingYear: number;
  units: number;
  totalPayment: number;
  generatedDate: string;
}

interface UtilityBill {
  id: number;
  billing_Acc_No: number;
  type: string;
  address: string;
  meter_No: string;
  unit_Price: number;
}

interface MonthlyUtilityBillFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentBill?: Partial<MonthlyUtilityBill>;
  refreshData: () => void;
}

const MonthlyUtilityBillForm: React.FC<MonthlyUtilityBillFormProps> = ({
  isOpen,
  onClose,
  currentBill,
  refreshData,
}) => {
  const navigate = useNavigate();
  const isEditMode = !!currentBill?.id;

  const [formValues, setFormValues] = useState<Partial<MonthlyUtilityBill>>(
    currentBill || {
      invoiceNo: 0,
      billingAccNo: 0,
      billingMonth: "",
      billingYear: new Date().getFullYear(),
      units: 0,
      totalPayment: 0,
      generatedDate: new Date().toISOString().split("T")[0],
    }
  );

  const [invoiceNoInput, setInvoiceNoInput] = useState(
    currentBill?.invoiceNo?.toString() || ""
  );
  const [totalPaymentInput, setTotalPaymentInput] = useState(
    currentBill?.totalPayment?.toString() || ""
  );
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>([]);
  const [existingMonthlyBills, setExistingMonthlyBills] = useState<
    MonthlyUtilityBill[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBillingAccounts, setIsLoadingBillingAccounts] = useState(
    false
  );
  const [isLoadingExistingBills, setIsLoadingExistingBills] = useState(false);

  // Get current date for validation
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed (January is 0)

  // Fetch utility bills to get billing account numbers for dropdown
  useEffect(() => {
    const fetchUtilityBills = async () => {
      setIsLoadingBillingAccounts(true);
      try {
        const response = await axios.get("/utilitybill/get");
        if (response.data) {
          setUtilityBills(response.data);
        }
      } catch (error) {
        console.error("Error fetching utility bills:", error);
        toast.error("Failed to load billing account numbers");
      } finally {
        setIsLoadingBillingAccounts(false);
      }
    };

    // Fetch existing monthly bills for duplicate validation
    const fetchExistingMonthlyBills = async () => {
      setIsLoadingExistingBills(true);
      try {
        const response = await axios.get("/monthlyutilitybill/get");
        if (response.data) {
          setExistingMonthlyBills(response.data);
        }
      } catch (error) {
        console.error("Error fetching existing monthly bills:", error);
      } finally {
        setIsLoadingExistingBills(false);
      }
    };

    if (isOpen) {
      fetchUtilityBills();
      fetchExistingMonthlyBills();
    }
  }, [isOpen]);

  // Update form values when currentBill changes
  useEffect(() => {
    if (currentBill) {
      setFormValues(currentBill);
      setInvoiceNoInput(currentBill.invoiceNo?.toString() || "");
      setTotalPaymentInput(currentBill.totalPayment?.toString() || "");
    }
  }, [currentBill]);

  // Handle invoice number input change (text field that only accepts numbers)
  const handleInvoiceNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 8 digits
    if (value === "" || (/^\d+$/.test(value) && value.length <= 8)) {
      setInvoiceNoInput(value);
      setFormValues((prev) => ({
        ...prev,
        invoiceNo: value === "" ? undefined : parseInt(value, 10),
      }));

      // Clear any existing invoice duplicate errors when the value changes
      if (errors.invoiceDuplicate) {
        setErrors((prev) => {
          const updatedErrors = { ...prev };
          delete updatedErrors.invoiceDuplicate;
          return updatedErrors;
        });
      }
    }
  };

  // Handle total payment input change (limit to 2 decimal places)
  const handleTotalPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Accept only numbers and one decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setTotalPaymentInput(value);
      setFormValues((prev) => ({
        ...prev,
        totalPayment: value === "" ? undefined : parseFloat(value),
      }));
    }
  };

  // Handle billing account number change
  const handleBillingAccNoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      billingAccNo: parseInt(value, 10),
    }));

    // Clear any existing duplicate errors when account number changes
    if (errors.duplicate) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors.duplicate;
        return updatedErrors;
      });
    }
  };

  // Handle month change with future date validation
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      billingMonth: value,
    }));

    // Check if the selected month and year combination is in the future
    if (value && formValues.billingYear) {
      const monthIndex = months.indexOf(value);

      if (monthIndex > -1) {
        const isFutureDate =
          formValues.billingYear > currentYear ||
          (formValues.billingYear === currentYear && monthIndex > currentMonth);

        // Update both month and year errors based on the combined future date check
        if (isFutureDate) {
          setErrors((prev) => ({
            ...prev,
            billingMonth: "Billing month and year cannot be in the future",
          }));
        } else {
          // Clear both month and year errors related to future dates
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.billingMonth;
            delete newErrors.billingYear;
            delete newErrors.billingDate;
            return newErrors;
          });
        }
      }
    }

    // Clear any duplicate errors
    if (errors.duplicate) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors.duplicate;
        return updatedErrors;
      });
    }
  };

  // Handle year change with future date validation
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value === "" || /^\d+$/.test(value)) {
      const yearValue = value === "" ? undefined : parseInt(value, 10);

      setFormValues((prev) => ({
        ...prev,
        billingYear: yearValue,
      }));

      // Check if the selected month and year combination is in the future
      if (yearValue && formValues.billingMonth) {
        const monthIndex = months.indexOf(formValues.billingMonth);

        if (monthIndex > -1) {
          const isFutureDate =
            yearValue > currentYear ||
            (yearValue === currentYear && monthIndex > currentMonth);

          // Update both month and year errors based on the combined future date check
          if (isFutureDate) {
            setErrors((prev) => ({
              ...prev,
              billingYear: "Billing month and year cannot be in the future",
            }));
          } else {
            // Clear both month and year errors related to future dates
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.billingMonth;
              delete newErrors.billingYear;
              delete newErrors.billingDate;
              return newErrors;
            });
          }
        }
      }
    }

    // Clear any duplicate errors
    if (errors.duplicate) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors.duplicate;
        return updatedErrors;
      });
    }
  };

  // Handle other input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Skip handling billingAccNo, billingMonth, billingYear, and totalPayment since we have separate handlers
    if (
      name === "billingAccNo" ||
      name === "billingMonth" ||
      name === "billingYear" ||
      name === "totalPayment"
    )
      return;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === "units"
          ? value === ""
            ? undefined
            : parseInt(value, 10)
          : value,
    }));
  };

  // Check for duplicate invoice number
  const checkForDuplicateInvoice = (): boolean => {
    if (!formValues.invoiceNo) {
      return false; // Cannot check for duplicates if invoice number is missing
    }

    const isDuplicate = existingMonthlyBills.some(
      (bill) =>
        bill.invoiceNo === formValues.invoiceNo &&
        (!isEditMode || bill.id !== currentBill?.id) // Exclude current record when editing
    );

    if (isDuplicate) {
      setErrors((prev) => ({
        ...prev,
        invoiceDuplicate:
          "This invoice number already exists. Please use a different invoice number.",
      }));
      return true;
    }

    return false;
  };

  // Check for duplicates
  const checkForDuplicates = (): boolean => {
    if (
      !formValues.billingAccNo ||
      !formValues.billingMonth ||
      !formValues.billingYear
    ) {
      return false; // Cannot check for duplicates if any of the values are missing
    }

    const isDuplicate = existingMonthlyBills.some(
      (bill) =>
        bill.billingAccNo === formValues.billingAccNo &&
        bill.billingMonth === formValues.billingMonth &&
        bill.billingYear === formValues.billingYear &&
        (!isEditMode || bill.id !== currentBill?.id) // Exclude current record when editing
    );

    if (isDuplicate) {
      setErrors((prev) => ({
        ...prev,
        duplicate:
          "A bill for this account, month, and year already exists. Please modify your selection.",
      }));
      return true;
    }

    return false;
  };

  // Check if month/year is in the future
  const isFutureDate = (): boolean => {
    if (!formValues.billingMonth || !formValues.billingYear) {
      return false;
    }

    const monthIndex = months.indexOf(formValues.billingMonth);
    if (monthIndex === -1) return false;

    return (
      formValues.billingYear > currentYear ||
      (formValues.billingYear === currentYear && monthIndex > currentMonth)
    );
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate Invoice Number
    if (!formValues.invoiceNo) {
      newErrors.invoiceNo = "Invoice number is required";
    } else if (formValues.invoiceNo <= 0) {
      newErrors.invoiceNo = "Invoice number must be a positive number";
    } else if (invoiceNoInput.length > 8) {
      newErrors.invoiceNo = "Invoice number must be a maximum of 8 digits";
    }

    // Validate Billing Account Number
    if (!formValues.billingAccNo) {
      newErrors.billingAccNo = "Billing account number is required";
    }

    // Validate Billing Month
    if (!formValues.billingMonth) {
      newErrors.billingMonth = "Billing month is required";
    }

    // Validate Billing Year
    if (!formValues.billingYear) {
      newErrors.billingYear = "Billing year is required";
    } else if (formValues.billingYear < 2000 || formValues.billingYear > 2100) {
      newErrors.billingYear = "Please enter a valid year between 2000 and 2100";
    }

    // Validate that billing month and year are not in the future
    if (formValues.billingMonth && formValues.billingYear) {
      if (isFutureDate()) {
        newErrors.billingDate =
          "Billing month and year cannot be in the future";
      }
    }

    // Validate Units
    if (formValues.units === undefined || formValues.units === null) {
      newErrors.units = "Units is required";
    } else if (formValues.units < 0) {
      newErrors.units = "Units must be a positive number";
    }

    // Validate Total Payment
    if (
      formValues.totalPayment === undefined ||
      formValues.totalPayment === null
    ) {
      newErrors.totalPayment = "Total payment is required";
    } else if (formValues.totalPayment <= 0) {
      newErrors.totalPayment = "Total payment must be a positive number";
    } else if (!/^\d+(\.\d{1,2})?$/.test(totalPaymentInput)) {
      newErrors.totalPayment =
        "Total payment can have a maximum of 2 decimal places";
    }

    // Validate Generated Date
    if (!formValues.generatedDate) {
      newErrors.generatedDate = "Generated date is required";
    } else {
      const selectedDate = new Date(formValues.generatedDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.generatedDate = "Generated date cannot be in the future";
      }
    }

    // Check for duplicates
    const hasDuplicate = checkForDuplicates();
    const hasDuplicateInvoice = checkForDuplicateInvoice();

    setErrors((prev) => ({
      ...newErrors,
      ...(hasDuplicate ? { duplicate: prev.duplicate } : {}),
      ...(hasDuplicateInvoice ? { invoiceDuplicate: prev.invoiceDuplicate } : {}),
    }));

    return (
      Object.keys(newErrors).length === 0 &&
      !hasDuplicate &&
      !hasDuplicateInvoice
    );
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const monthlyBillData = {
        ...(isEditMode && { id: currentBill?.id }),
        invoiceNo: formValues.invoiceNo,
        billingAccNo: formValues.billingAccNo,
        billingMonth: formValues.billingMonth,
        billingYear: formValues.billingYear,
        units: formValues.units,
        totalPayment: formValues.totalPayment,
        generatedDate: formValues.generatedDate,
      };

      if (isEditMode) {
        await axios.put("/monthlyutilitybill/update", monthlyBillData);
        toast.success("Monthly utility bill updated successfully");
      } else {
        await axios.post("/monthlyutilitybill/save", monthlyBillData);
        toast.success("Monthly utility bill saved successfully");
      }

      refreshData();
      onClose();
    } catch (error) {
      toast.error("Error saving monthly utility bill");
      console.error("Error saving monthly utility bill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Months array for dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode ? "Edit Monthly Utility Bill" : "Add Monthly Utility Bill"
      }
    >
      <form onSubmit={handleSubmit} className="mt-4">
        {/* Display duplicate errors at the top if they exist */}
        {(errors.duplicate || errors.invoiceDuplicate) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.duplicate && (
              <p className="font-medium">{errors.duplicate}</p>
            )}
            {errors.invoiceDuplicate && (
              <p className="font-medium">{errors.invoiceDuplicate}</p>
            )}
          </div>
        )}

        {/* Future date error at the top if exists */}
        {errors.billingDate && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium">{errors.billingDate}</p>
          </div>
        )}

        {/* Invoice Number - Changed to text field that only accepts numbers with max 8 digits */}
        <div className="mb-4">
          <label
            htmlFor="invoiceNo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Invoice Number<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="invoiceNo"
            name="invoiceNo"
            value={invoiceNoInput}
            onChange={handleInvoiceNoChange}
            placeholder="Enter invoice number (max 8 digits)"
            maxLength={8}
            className={`w-full px-3 py-2 border ${
              errors.invoiceNo || errors.invoiceDuplicate
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.invoiceNo && (
            <p className="mt-1 text-sm text-red-600">{errors.invoiceNo}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Invoice number must be unique and maximum 8 digits
          </p>
        </div>

        {/* Billing Account Number - Changed to dropdown with existing billing account numbers */}
        <div className="mb-4">
          <label
            htmlFor="billingAccNo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Billing Account Number<span className="text-red-500">*</span>
          </label>
          {isLoadingBillingAccounts ? (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"></div>
              <span className="ml-2 text-sm text-gray-500">
                Loading billing accounts...
              </span>
            </div>
          ) : (
            <select
              id="billingAccNo"
              name="billingAccNo"
              value={formValues.billingAccNo || ""}
              onChange={handleBillingAccNoChange}
              className={`w-full px-3 py-2 border ${
                errors.billingAccNo ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select Billing Account</option>
              {utilityBills.map((bill) => (
                <option key={bill.id} value={bill.billing_Acc_No}>
                  {bill.billing_Acc_No} - {bill.type} (
                  {bill.address.substring(0, 30)}
                  {bill.address.length > 30 ? "..." : ""})
                </option>
              ))}
            </select>
          )}
          {errors.billingAccNo && (
            <p className="mt-1 text-sm text-red-600">{errors.billingAccNo}</p>
          )}
        </div>

        {/* Billing Year */}
        <div className="mb-4">
          <label
            htmlFor="billingYear"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Billing Year<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="billingYear"
            name="billingYear"
            min="2000"
            max="2100"
            value={formValues.billingYear || ""}
            onChange={handleYearChange}
            placeholder="Enter billing year"
            className={`w-full px-3 py-2 border ${
              errors.billingYear ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.billingYear && (
            <p className="mt-1 text-sm text-red-600">{errors.billingYear}</p>
          )}
        </div>

        {/* Rest of the form fields remain unchanged */}
        {/* Billing Month */}
        <div className="mb-4">
          <label
            htmlFor="billingMonth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Billing Month<span className="text-red-500">*</span>
          </label>
          <select
            id="billingMonth"
            name="billingMonth"
            value={formValues.billingMonth || ""}
            onChange={handleMonthChange}
            className={`w-full px-3 py-2 border ${
              errors.billingMonth ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {errors.billingMonth && (
            <p className="mt-1 text-sm text-red-600">{errors.billingMonth}</p>
          )}
        </div>

        {/* Units */}
        <div className="mb-4">
          <label
            htmlFor="units"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Units<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="units"
            name="units"
            min="0"
            value={formValues.units || ""}
            onChange={handleInputChange}
            placeholder="Enter units consumed"
            className={`w-full px-3 py-2 border ${
              errors.units ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.units && (
            <p className="mt-1 text-sm text-red-600">{errors.units}</p>
          )}
        </div>

        {/* Total Payment */}
        <div className="mb-4">
          <label
            htmlFor="totalPayment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Total Payment<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="totalPayment"
            name="totalPayment"
            value={totalPaymentInput}
            onChange={handleTotalPaymentChange}
            placeholder="Enter total payment amount (Max 2 decimals)"
            className={`w-full px-3 py-2 border ${
              errors.totalPayment ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.totalPayment && (
            <p className="mt-1 text-sm text-red-600">{errors.totalPayment}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter amount with maximum 2 decimal places (e.g. 123.45)
          </p>
        </div>

        {/* Generated Date */}
        <div className="mb-4">
          <label
            htmlFor="generatedDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Generated Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="generatedDate"
            name="generatedDate"
            value={formValues.generatedDate || ""}
            className={`w-full px-3 py-2 border ${
              errors.generatedDate ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEditMode ? "bg-gray-100" : ""
            }`}
            readOnly={isEditMode}
            onChange={!isEditMode ? handleInputChange : undefined}
            max={new Date().toISOString().split("T")[0]}
            required
          />
          {errors.generatedDate && (
            <p className="mt-1 text-sm text-red-600">{errors.generatedDate}</p>
          )}
          {isEditMode && (
            <p className="mt-1 text-xs text-gray-500">
              Generated date cannot be modified once created
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end mt-8 gap-4">
          <button
            type="button"
            onClick={onClose}
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
            disabled={isSubmitting || isLoadingExistingBills}
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MonthlyUtilityBillForm;