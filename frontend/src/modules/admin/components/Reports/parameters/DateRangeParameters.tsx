import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeParametersProps {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

const DateRangeParameters: React.FC<DateRangeParametersProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          className="w-full p-2 border rounded-md"
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          className="w-full p-2 border rounded-md"
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          minDate={startDate || undefined}
        />
      </div>
    </div>
  );
};

export default DateRangeParameters;