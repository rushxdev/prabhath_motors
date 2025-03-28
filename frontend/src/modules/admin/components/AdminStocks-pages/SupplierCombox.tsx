import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { supplierService } from '../../../../services/stockSupplierService';
import { Supplier } from '../../../../types/Stock';

interface SupplierComboboxProps {
    selectedSupplier: Supplier | null;
    onSupplierSelect: (supplier: Supplier | null) => void;
}

export const SupplierCombobox: React.FC<SupplierComboboxProps> = ({
    selectedSupplier,
    onSupplierSelect
}) => {
    const [query, setQuery] = useState('');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const data = await supplierService.getAllSuppliers();
                setSuppliers(data);
            } catch (error) {
                console.error('Failed to load suppliers:', error);
            }
        };
        loadSuppliers();
    }, []);

    const filteredSuppliers = query === ''
        ? suppliers
        : suppliers.filter((supplier) =>
            supplier.supplierName
                .toLowerCase()
                .includes(query.toLowerCase())
        );

    const isNewSupplier = query !== '' && 
        !suppliers.some(s => 
            s.supplierName.toLowerCase() === query.toLowerCase()
        );

    return (
        <div className="relative">
            <Combobox value={selectedSupplier} onChange={onSupplierSelect}>
                <div className="relative mt-1">
                    <Combobox.Input
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        displayValue={(supplier: Supplier | null) => 
                            supplier?.supplierName || ''
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Select or type supplier name"
                    />
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredSuppliers.map((supplier) => (
                            <Combobox.Option
                                key={supplier.supplierId}
                                value={supplier}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                        active ? 'bg-primary text-black' : 'text-gray-900'
                                    }`
                                }
                            >
                                {supplier.supplierName}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
            </Combobox>
            {isNewSupplier && (
                <div className="mt-2">
                    <span className="text-green-600 text-sm">
                        New supplier! {' '}
                        <button
                            onClick={() => navigate('/admin/supplier-details')}
                            className="underline hover:text-green-700"
                        >
                            Click here to add new supplier
                        </button>
                    </span>
                </div>
            )}
        </div>
    );
};