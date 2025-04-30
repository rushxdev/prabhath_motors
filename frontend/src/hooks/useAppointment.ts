import React, { useState } from "react";
import { Appointment } from "../types/Appointment"
import { addAppointment } from "../services/appointmentService";

export const useAppointment = () => {
    const [appointment, setAppointment] = useState<Appointment>({
        vehicleRegistrationNo: "",
        date: "",
        time: "",
        mileage: 0,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string} = {};
        const vehicleRegPattern = /^(?:[A-Z]{2,3}-\d{4}|\d{2,3}-\d{4})$/;

        if(!vehicleRegPattern.test(appointment.vehicleRegistrationNo)) {
            newErrors.vehicleRegistrationNo = "Invalid vehicle registration number";
        }

        const today = new Date();
        const selectedDate = new Date(appointment.date);
        today.setHours(0, 0, 0, 0);

        if(!appointment.date) {
            newErrors.date = "Date is required";
        } else if (selectedDate < today) {
            newErrors.date = "Date cannot be in the past";
        }

        // Updated mileage validation
        if (appointment.mileage < 0) {
            newErrors.mileage = "Mileage must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        const updatedErrors = { ...errors };

        // Real-time validation for vehicle registration number
        if (name === "vehicleRegistrationNo") {
            const vehicleRegPattern = /^(?:[A-Z]{2,3}-\d{4}|\d{2,3}-\d{4})$/;
            
            // Prevent non-alphanumeric and limit length
            const sanitizedValue = value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
            
            // Validate in real-time
            if (sanitizedValue && !vehicleRegPattern.test(sanitizedValue)) {
                updatedErrors.vehicleRegistrationNo = "Invalid vehicle registration number format";
            } else {
                delete updatedErrors.vehicleRegistrationNo;
            }

            setAppointment((prev) => ({ ...prev, [name]: sanitizedValue }));
        } 
        // Real-time validation for date
        else if (name === "date") {
            const today = new Date();
            const selectedDate = new Date(value);
            today.setHours(0, 0, 0, 0);

            if (!value) {
                updatedErrors.date = "Date is required";
            } else if (selectedDate < today) {
                updatedErrors.date = "Date cannot be in the past";
            } else {
                delete updatedErrors.date;
            }

            setAppointment((prev) => ({ ...prev, [name]: value }));
        }
        // Mileage handling
        else if (name === "mileage") {
            const numericValue = parseInt(value);
            setAppointment((prev) => ({ ...prev, [name]: isNaN(numericValue) ? 0 : numericValue }));
        } 
        // Default handling for other fields
        else {
            setAppointment((prev) => ({ ...prev, [name]: value }));
        }

        // Update errors
        setErrors(updatedErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!validateForm()) return false;

        try {
            await addAppointment(appointment);
            setAppointment({ vehicleRegistrationNo: "", date: "", time: "", mileage: 0 });
            setErrors({});  // Clear errors on successful submission
            return true;
        } catch (error) {
            console.error("Error while booking appointment", error);
            return false;
        }
    };

    return { 
        appointment, 
        setAppointment, 
        errors, 
        handleChange, 
        handleSubmit,
        validateForm 
    };
}