import React, { useState, useEffect, useRef } from "react";
import Modal from "../../../../components/Model";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart, Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChartOptions } from "chart.js";
import { FilmIcon } from "@heroicons/react/24/outline";

// Register all ChartJS components
ChartJS.register(...registerables);

interface MonthlyUtilityBill {
  id: number;
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

interface UtilityChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyBills: MonthlyUtilityBill[];
}

type ChartType = "line" | "bar" | "pie";
type DataVariable = "totalPayment" | "units";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const UtilityChartModal: React.FC<UtilityChartModalProps> = ({
  isOpen,
  onClose,
  monthlyBills,
}) => {
  // State for user selections
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dataVariable, setDataVariable] = useState<DataVariable>("totalPayment");
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedBillingAccNo, setSelectedBillingAccNo] = useState<number | "all">("all");
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch utility bills to get billing account numbers
  useEffect(() => {
    const fetchUtilityBills = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8081/utilitybill/get");
        if (response.ok) {
          const data = await response.json();
          setUtilityBills(data);
        }
      } catch (error) {
        console.error("Error fetching utility bills:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUtilityBills();
    }
  }, [isOpen]);

  // Get unique billing account numbers
  const uniqueBillingAccNos = React.useMemo(() => {
    const accNos = new Set<number>();
    monthlyBills.forEach((bill) => accNos.add(bill.billingAccNo));
    return Array.from(accNos);
  }, [monthlyBills]);

  // Filter data based on user selections
  const filteredData = React.useMemo(() => {
    return monthlyBills.filter((bill) => {
      // Convert bill date to Date object
      const billDate = new Date(bill.billingYear, months.indexOf(bill.billingMonth), 1);
      const isAfterStart = billDate >= startDate;
      const isBeforeEnd = billDate <= new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
      const matchesAccount = selectedBillingAccNo === "all" || bill.billingAccNo === selectedBillingAccNo;
      
      return isAfterStart && isBeforeEnd && matchesAccount;
    });
  }, [monthlyBills, startDate, endDate, selectedBillingAccNo]);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    // Group data by month and year for chronological order
    const groupedData: Record<string, number> = {};
    
    filteredData.forEach((bill) => {
      const dateKey = `${bill.billingYear}-${String(months.indexOf(bill.billingMonth) + 1).padStart(2, "0")}`;
      const value = bill[dataVariable];
      
      if (groupedData[dateKey]) {
        groupedData[dateKey] += value;
      } else {
        groupedData[dateKey] = value;
      }
    });
    
    // Sort dates
    const sortedDates = Object.keys(groupedData).sort();
    
    // Format dates for display
    const labels = sortedDates.map((date) => {
      const [year, month] = date.split("-");
      return `${months[parseInt(month) - 1]} ${year}`;
    });
    
    const values = sortedDates.map((date) => groupedData[date]);
    
    // Generate chart colors
    const backgroundColor = Array(values.length).fill('').map(() => 
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );
    
    return {
      labels,
      datasets: [
        {
          label: dataVariable === "totalPayment" ? "Total Payment (Rs)" : "Units Consumed",
          data: values,
          backgroundColor: chartType === "line" ? "rgba(75, 192, 192, 0.6)" : backgroundColor,
          borderColor: chartType === "line" ? "rgba(75, 192, 192, 1)" : backgroundColor,
          borderWidth: 1,
          fill: chartType === "line" ? false : undefined,
        },
      ],
    };
  }, [filteredData, dataVariable, chartType]);

  // Custom options for the chart
  const chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: dataVariable === "totalPayment" 
          ? "Monthly Utility Payment Trends" 
          : "Monthly Utility Units Consumption",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: { dataset: { label?: string }; parsed: { y: number | null } }) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += dataVariable === "totalPayment" 
                ? new Intl.NumberFormat("en-US", { style: "currency", currency: "LKR" }).format(context.parsed.y)
                : context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: chartType !== "pie" ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: dataVariable === "totalPayment" ? "Amount (Rs)" : "Units",
        },
        ticks: {
          callback: function(value: number | string) {
            if (dataVariable === "totalPayment") {
              return 'Rs ' + value;
            }
            return value;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    } : undefined,
  };

  // Function to render the appropriate chart based on user selection
  const renderChart = () => {
    const props = {
      data: chartData,
      options: chartOptions,
      height: 300,
    };

    switch (chartType) {
      case "line":
        return <Line {...props} />;
      case "bar":
        return <Bar {...props} />;
      case "pie":
        return <Pie {...props} />;
      default:
        return <Line {...props} />;
    }
  };

  // Get utility bill details for a billing account number
  const getBillDetails = (billingAccNo: number) => {
    const bill = utilityBills.find((b) => b.billing_Acc_No === billingAccNo);
    return bill 
      ? `${bill.billing_Acc_No} - ${bill.type} (${bill.address.substring(0, 20)}${bill.address.length > 20 ? "..." : ""})`
      : billingAccNo.toString();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Utility Bill Analytics">
      <div className="p-4">
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Chart Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
              <div className="flex space-x-2">
                {["line", "bar", "pie"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 text-sm rounded-md ${
                      chartType === type
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setChartType(type as ChartType)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Variable Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Variable</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm rounded-md ${
                    dataVariable === "totalPayment"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setDataVariable("totalPayment")}
                >
                  Payment Amount
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm rounded-md ${
                    dataVariable === "units"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setDataVariable("units")}
                >
                  Units Consumed
                </button>
              </div>
            </div>

            {/* Date Range Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => date && setStartDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => date && setEndDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Billing Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Account Number
              </label>
              <select
                value={selectedBillingAccNo === "all" ? "all" : selectedBillingAccNo}
                onChange={(e) => setSelectedBillingAccNo(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Accounts</option>
                {uniqueBillingAccNos.map((accNo) => (
                  <option key={accNo} value={accNo}>
                    {loading ? `Loading...` : getBillDetails(accNo)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chart Display */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="h-[400px] w-full">
            {filteredData.length > 0 ? (
              renderChart()
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">
                  No data available for the selected criteria
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        {filteredData.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-xl font-bold">{filteredData.length}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">
                  {dataVariable === "totalPayment" ? "Total Payment" : "Total Units"}
                </p>
                <p className="text-xl font-bold">
                  {dataVariable === "totalPayment" 
                    ? `Rs ${filteredData.reduce((sum, bill) => sum + bill.totalPayment, 0).toLocaleString()}`
                    : filteredData.reduce((sum, bill) => sum + bill.units, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">
                  {dataVariable === "totalPayment" ? "Average Payment" : "Average Units"}
                </p>
                <p className="text-xl font-bold">
                  {dataVariable === "totalPayment"
                    ? `Rs ${(
                        filteredData.reduce((sum, bill) => sum + bill.totalPayment, 0) /
                        filteredData.length
                      ).toFixed(2)}`
                    : (
                        filteredData.reduce((sum, bill) => sum + bill.units, 0) /
                        filteredData.length
                      ).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">
                  {dataVariable === "totalPayment" ? "Max Payment" : "Max Units"}
                </p>
                <p className="text-xl font-bold">
                  {dataVariable === "totalPayment"
                    ? `Rs ${Math.max(...filteredData.map((bill) => bill.totalPayment)).toLocaleString()}`
                    : Math.max(...filteredData.map((bill) => bill.units)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UtilityChartModal;