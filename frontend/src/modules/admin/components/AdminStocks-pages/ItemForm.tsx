import React, { useState, useEffect, useCallback } from 'react';
import { Button, Combobox } from '@headlessui/react';
import { BarcodeScanner } from './BarcodeScanner';
import { ItemCategory, StockItem, Supplier } from '../../../../types/Stock';
import { SupplierCombobox } from './SupplierCombox';

interface ItemFormProps {
    initialData?: Partial<StockItem>;
    categories: ItemCategory[];
    onSuccess: (item: Partial<StockItem>) => void;
    onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
    initialData,
    categories,
    onSuccess,
    onCancel,
}) => {
    const [query, setQuery] = useState('');
    const [formData, setFormData] = useState<Partial<StockItem>>(() => {
        if (initialData) {
            // If initialData exists (updating)
            return { ...initialData };
        } else {
            // If no initialData (creating new), use empty/undefined values
            return {
                itemID: undefined,
                itemCtgryID: undefined,
                supplierId: undefined,
                itemName: '',
                itemBarcode: '',
                recorderLevel: undefined,
                qtyAvailable: undefined,
                itemBrand: '',
                sellPrice: undefined,
                unitPrice: undefined,
                rackNo: undefined,
                updatedDate: new Date().toISOString().split('T')[0]
            };
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);

    const [brandError, setBrandError] = useState<string | null>(null);
    const [unitPriceError, setUnitPriceError] = useState<string | null>(null);
    const [sellPriceError, setSellPriceError] = useState<string | null>(null);
    const [recorderLevelError, setRecorderLevelError] = useState<string | null>(null);
    const [qtyAvailableError, setQtyAvailableError] = useState<string | null>(null);
    const [rackNoError, setRackNoError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                updatedDate: initialData.updatedDate?.split('T')[0] || new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    useEffect(() => {
        if (selectedSupplier) {
            setFormData(prev => ({
                ...prev,
                supplierId: selectedSupplier.supplierId
            }));
        }
    }, [selectedSupplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        //name validation
        if (name === 'itemName') {
            if (value.length < 3) {
                setNameError('Item name must be at least 3 characters long');
            } else if (value.length > 50) {
                setNameError('Item name cannot exceed 50 characters');
            } else if (!/^[a-zA-Z0-9\s-]+$/.test(value)) {
                setNameError('Item name can only contain letters, numbers, spaces, and hyphens');
            } else {
                setNameError(null);
            }
        }


        // Add brand validation
        if (name === 'itemBrand') {
            if (value.length === 0) {
                setBrandError('Brand name is required');
            } else if (/^[0-9]/.test(value)) {
                setBrandError('Brand name cannot start with a number');
            } else if (value.length < 3) {
                setBrandError('Brand name must be at least 3 characters long');
            } else if (value.length > 30) {
                setBrandError('Brand name cannot exceed 30 characters');
            } else if (!/^[a-zA-Z][a-zA-Z0-9\s-]*$/.test(value)) {
                setBrandError('Brand name must start with a letter and can only contain letters, numbers, spaces, and hyphens');
            } else {
                setBrandError(null);
            }
        }

        // Add unit price validation
        if (name === 'unitPrice') {
            const price = Number(value);
            if (value === '') {
                setUnitPriceError('Unit price is required');
            } else if (price <= 0) {
                setUnitPriceError('Unit price must be greater than 0');
            } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                setUnitPriceError('Enter a valid price (up to 2 decimal places)');
            } else {
                setUnitPriceError(null);
            }
        }

        // Add sell price validation
        if (name === 'sellPrice') {
            const price = Number(value);
            if (value === '') {
                setSellPriceError('Sell price is required');
            } else if (price <= 0) {
                setSellPriceError('Sell price must be greater than 0');
            } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                setSellPriceError('Enter a valid price (up to 2 decimal places)');
            } else {
                setSellPriceError(null);
            }
        }

        // Recorder Level validation
        if (name === 'recorderLevel') {
            const level = Number(value);
            if (value === '') {
                setRecorderLevelError('Recorder level is required');
            } else if (!Number.isInteger(level)) {
                setRecorderLevelError('Recorder level must be a whole number');
            } else if (level <= 0) {
                setRecorderLevelError('Recorder level must be greater than 0');
            } else {
                setRecorderLevelError(null);
            }
        }

        // Quantity Available validation
        if (name === 'qtyAvailable') {
            const qty = Number(value);
            if (value === '') {
                setQtyAvailableError('Quantity is required');
            } else if (!Number.isInteger(qty)) {
                setQtyAvailableError('Quantity must be a whole number');
            } else if (qty <= 0) {
                setQtyAvailableError('Quantity must be greater than 0');
            } else {
                setQtyAvailableError(null);
            }
        }

        // Rack Number validation
        if (name === 'rackNo') {
            const rackNo = Number(value);
            if (value === '') {
                setRackNoError('Rack number is required');
            } else if (!Number.isInteger(rackNo)) {
                setRackNoError('Rack number must be a whole number');
            } else if (rackNo <= 0) {
                setRackNoError('Rack number must be greater than 0');
            } else {
                setRackNoError(null);
            }
        }


        setFormData(prev => ({
            ...prev,
            [name]: name.includes('itemCtgryID') || name.includes('Id') || 
                    name.includes('Level') || name.includes('Price') || 
                    name.includes('No') || name.includes('Available')
                    ? Number(value) : value
        }));
    };

    const createNewCategory = async (categoryName: string): Promise<ItemCategory> => {
        const response = await fetch('http://localhost:8081/itemCtgry/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemCtgryName: categoryName
            })
        });
    
        if (!response.ok) {
            throw new Error('Failed to create new category');
        }
    
        return response.json();
    };
    
    //handle new categories
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {

            if (nameError || brandError || unitPriceError || sellPriceError) {
                throw new Error('Please fix the form errors before submitting.');

            }
    
            let categoryId = formData.itemCtgryID;
    
            // If it's a new category, create it first and get the ID
            if (selectedCategory && selectedCategory.itemCtgryId === -1) {
                const newCategory = await createNewCategory(selectedCategory.itemCtgryName);
                categoryId = newCategory.itemCtgryId; // Get the new category ID
            }
    
            //save/update the item with correct category ID
            onSuccess({
                ...formData,
                itemCtgryID: categoryId // Use the new category ID or existing one
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleBarcodeScan = useCallback((barcode: string) => {
        setFormData(prev => ({
            ...prev,
            itemBarcode: barcode
        }));
        setIsScanning(false);
    }, []);

    const filteredCategories = query === ''
        ? categories
        : categories.filter((category) => {
            return category.itemCtgryName.toLowerCase().includes(query.toLowerCase());
        });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category<span className="text-red-500">*</span>
                    </label>
                    <Combobox
                        value={selectedCategory}
                        onChange={(category: ItemCategory | null) => {
                            setSelectedCategory(category);
                            if (category) {
                                setFormData(prev => ({
                                    ...prev,
                                    itemCtgryID: category.itemCtgryId 
                                }));
                            }
                        }}
                    >
                        <div className="relative mt-1">
                            <Combobox.Input
                                className="w-full rounded-md border border-gray-300 p-2"
                                displayValue={(category: ItemCategory | null) => category?.itemCtgryName ?? ''}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    if (event.target.value === '') {
                                        setSelectedCategory(null);
                                    }
                                    // Handle new category creation
                                    if (!filteredCategories.some(cat => 
                                        cat.itemCtgryName.toLowerCase() === event.target.value.toLowerCase()
                                    )) {
                                        setSelectedCategory({
                                            itemCtgryId: -1, // Temporary ID of new category
                                            itemID: -1,
                                            itemCtgryName: event.target.value
                                        });
                                    }
                                }}
                                placeholder="Search or enter new category..."
                            />
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredCategories.length === 0 && query !== '' ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Nothing found.
                                    </div>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <Combobox.Option
                                            key={category.itemCtgryId}
                                            value={category}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                                    active ? 'bg-green-600 text-white' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {category.itemCtgryName}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </div>
                    </Combobox>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Supplier
                    </label>
                    <SupplierCombobox
                        selectedSupplier={selectedSupplier}
                        onSupplierSelect={setSelectedSupplier}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Item Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
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
                        Item Barcode<span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            name="itemBarcode"
                            value={formData.itemBarcode}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            placeholder="Scan or enter barcode"
                        />
                        <Button
                            type="button"
                            onClick={() => setIsScanning(true)}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                            Scan
                        </Button>
                    </div>
                </div>

                {isScanning && (
                    <BarcodeScanner
                        onScanned={handleBarcodeScan}
                        onClose={() => setIsScanning(false)}
                    />
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Recorder Level<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="recorderLevel"
                        value={formData.recorderLevel}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />

                    {recorderLevelError && <p className="text-red-500 text-sm mt-1">{recorderLevelError}</p>}

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Quantity Available<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="qtyAvailable"
                        value={formData.qtyAvailable}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />

                    {qtyAvailableError && <p className="text-red-500 text-sm mt-1">{qtyAvailableError}</p>}

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Item Brand<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="itemBrand"
                        value={formData.itemBrand}
                        onChange={handleChange}

                        className={`mt-1 block w-full rounded-md border p-2 ${
                            brandError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {brandError && <p className="text-red-500 text-sm mt-1">{brandError}</p>}

                </div>

                {/* Only show unit price field for new items */}
                {!initialData && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Unit Price<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="unitPrice"
                            value={formData.unitPrice}
                            onChange={handleChange}

                            min="0.01"
                            step="0.01"
                            className={`mt-1 block w-full rounded-md border p-2 ${
                                unitPriceError ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {unitPriceError && <p className="text-red-500 text-sm mt-1">{unitPriceError}</p>}

                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Sell Price<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="sellPrice"
                        value={formData.sellPrice}
                        onChange={handleChange}

                        min="0.01"
                        step="0.01"
                        className={`mt-1 block w-full rounded-md border p-2 ${
                            sellPriceError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {sellPriceError && <p className="text-red-500 text-sm mt-1">{sellPriceError}</p>}

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Rack Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="rackNo"
                        value={formData.rackNo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />

                    {rackNoError && <p className="text-red-500 text-sm mt-1">{rackNoError}</p>}

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
                    {initialData?.itemID ? 'Update Item' : 'Create Item'}
                </Button>
            </div>
        </form>
    );
};

export default ItemForm;