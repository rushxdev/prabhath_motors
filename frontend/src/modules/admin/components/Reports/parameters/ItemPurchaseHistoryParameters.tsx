import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { StockItem } from '../../../../../types/Stock';

interface ItemPurchaseHistoryParametersProps {
    startDate: Date | null;
    setStartDate: (date: Date | null) => void;
    endDate: Date | null;
    setEndDate: (date: Date | null) => void;
    selectedItemId: number | null;
    setSelectedItemId: (id: number | null) => void;
}

const ItemPurchaseHistoryParameters: React.FC<ItemPurchaseHistoryParametersProps> = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedItemId,
    setSelectedItemId
}) => {
    const [items, setItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:8081/item/get');
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch items (${response.status})`);
                }
                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error fetching items');
                console.error('Error fetching items:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    // Set the selected item name in search field when selectedItemId changes
    useEffect(() => {
        if (selectedItemId) {
            const item = items.find(item => item.itemID === selectedItemId);
            if (item) {
                setSelectedItem(item);
                setSearchQuery(item.itemName);
            }
        }
    }, [selectedItemId, items]);

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return [];
        
        const query = searchQuery.toLowerCase();
        return items.filter(item => 
            item.itemName.toLowerCase().includes(query) || 
            item.itemBarcode.toString().includes(query)
        ).slice(0, 10); // Limit to 10 suggestions for better UX
    }, [items, searchQuery]);

    const handleItemSelect = (item: StockItem) => {
        setSelectedItem(item);
        setSelectedItemId(item.itemID);
        setSearchQuery(item.itemName);
        setShowDropdown(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim() === '') {
            setSelectedItemId(null);
            setSelectedItem(null);
        }
        setShowDropdown(value.trim().length > 0);
    };

    const handleInputClick = () => {
        if (searchQuery.trim().length > 0) {
            setShowDropdown(true);
        }
    };

    const handleInputBlur = () => {
        // Small delay to allow clicking on suggestions
        setTimeout(() => {
            setShowDropdown(false);
        }, 200);
    };

    return (
        <div className="space-y-4">
            {/* Item Search with Autocomplete */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Item
                </label>
                {loading ? (
                    <p className="text-sm text-gray-500">Loading items...</p>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-orange-500">No items available</p>
                ) : (
                    <div className="relative">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md"
                                placeholder="Search items by name or barcode..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onClick={handleInputClick}
                                onBlur={handleInputBlur}
                                autoComplete="off"
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedItemId(null);
                                        setSelectedItem(null);
                                    }}
                                    type="button"
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        
                        {/* Suggestions Dropdown */}
                        {showDropdown && filteredItems.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredItems.map((item) => (
                                    <div 
                                        key={item.itemID} 
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                                        onClick={() => handleItemSelect(item)}
                                    >
                                        <span>{item.itemName}</span>
                                        <span className="text-gray-500">Barcode: {item.itemBarcode}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {searchQuery && filteredItems.length === 0 && (
                            <p className="text-sm text-orange-500 mt-1">No matching items found</p>
                        )}
                        
                        {selectedItem && (
                            <p className="text-xs text-green-500 mt-1">
                                Selected item: {selectedItem.itemName} (Barcode: {selectedItem.itemBarcode})
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="w-full p-2 border rounded-md"
                        placeholderText="Select start date"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || undefined}
                        className="w-full p-2 border rounded-md"
                        placeholderText="Select end date"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
            </div>
        </div>
    );
};

export default ItemPurchaseHistoryParameters;