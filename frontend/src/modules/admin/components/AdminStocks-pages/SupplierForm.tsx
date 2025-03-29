import React, { useState, useEffect } from 'react';
import { Button } from '@headlessui/react';
import { Supplier } from '../../../../types/Stock';

interface SupplierFormProps {
    initialData?: Partial<Supplier>;
    onSuccess: (supplier: Partial<Supplier>) => void;
    onCancel: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
    initialData,
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<Partial<Supplier>>(() => {
        return initialData || {
            supplierId: undefined,
            supplierName: '',
            email: '',
            contact: ''
        };
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [contactError, setContactError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validation
        if (name === 'supplierName') {
            if (value.length < 3) {
                setNameError('Supplier name must be at least 3 characters long');
            } else if (value.length > 50) {
                setNameError('Supplier name cannot exceed 50 characters');
            } else {
                setNameError(null);
            }
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError(null);
            }
        }

        if (name === 'contact') {
            const contactRegex = /^\+?\d{10,12}$/;
            if (!contactRegex.test(value)) {
                setContactError('Please enter a valid phone number (10-12 digits)');
            } else {
                setContactError(null);
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (nameError || emailError || contactError) {
                throw new Error('Please fix the form errors before submitting.');
            }

            await onSuccess(formData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Supplier Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="supplierName"
                        value={formData.supplierName}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border p-2 ${
                            nameError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border p-2 ${
                            emailError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Contact Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border p-2 ${
                            contactError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {contactError && <p className="text-red-500 text-sm mt-1">{contactError}</p>}
                </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex justify-end space-x-2 mt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {initialData ? 'Update Supplier' : 'Create Supplier'}
                </Button>
            </div>
        </form>
    );
};

export default SupplierForm;