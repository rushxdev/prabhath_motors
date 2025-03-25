import React, { useState, useEffect } from 'react';
import { Button, Combobox } from '@headlessui/react';

interface ItemFormProps {
    initialData?: Partial<StockItem>;
    stocks: StockItem[];
    categories: ItemCategory[];
    onSuccess: (item: Partial<StockItem>) => void;
    onCancel: () => void;
}

interface StockItem {
    itemID?: number;
    itemCtgryID: number;
    supplierId: number;
    itemName: string;
    itemBarcode: string;
    recorderLevel: number;
    qtyAvailable: number;
    itemBrand: string;
    unitPrice: number;
    stockLevel: string;
    rackNo: number;
    updatedDate: string;
}

interface ItemCategory {
    itemCtgryId: number;
    itemID: number;
    itemCtgryName: string;
}

const ItemForm: React.FC<ItemFormProps> = ({
    initialData,
    categories,
    onSuccess,
    onCancel,
}) => {
    const [query, setQuery] = useState('');
    const [formData, setFormData] = useState<Partial<StockItem>>({
        itemID: undefined,
        itemCtgryID: 0,
        supplierId: 0,
        itemName: '',
        itemBarcode: '',
        recorderLevel: 0,
        qtyAvailable: 0,
        itemBrand: '',
        unitPrice: 0,
        stockLevel: '',
        rackNo: 0,
        updatedDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);


    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                updatedDate: initialData.updatedDate?.split('T')[0] || new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Add name validation
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

        setFormData(prev => ({
            ...prev,
            [name]: name.includes('ID') || name.includes('Id') || 
                    name.includes('Level') || name.includes('Price') || 
                    name.includes('No') || name.includes('Available')
                    ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (nameError) {
            setError('Please fix the errors before submitting.');
            setLoading(false);
            return;
        }

        onSuccess(formData);
        setLoading(false);
    };

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
                                }}
                                placeholder="Search for a category..."
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Supplier ID<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
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
                    <input
                        type="text"
                        name="itemBarcode"
                        value={formData.itemBarcode}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>

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
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Unit Price<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Stock Level<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="stockLevel"
                        value={formData.stockLevel}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
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